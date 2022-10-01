package io.jokester.nuthatch.twitter

import cats.data.Ior
import cats.effect.IO
import com.typesafe.scalalogging.LazyLogging
import twitter4j.{CursorSupport, TwitterException}

trait TwitterFetcher[A] extends LazyLogging {

  type ApiRes <: twitter4j.TwitterResponse with CursorSupport

  def doFetch(cursor: Long): IO[ApiRes]

  def extractValues(apiRes: ApiRes): Seq[A]

  def fetchAll(): IO[Ior[Throwable, Seq[A]]] = fetchHead(Int.MaxValue)

  def apiTag: String = "(unknown)"

  def fetchHead(limit: Int): IO[Ior[Throwable, Seq[A]]] = {
    for (
      firstPage <- doFetch(-1).flatTap(tapLog).attempt;
      merged <- firstPage match {
        case Left(e)  => IO.pure(Ior.Left(e))
        case Right(p) => fetchMore(extractValues(p), p, limit)
      }
    ) yield merged
  }

  private def fetchMore(
      acc: Seq[A],
      previousFetch: ApiRes,
      limit: Int,
  ): IO[Ior[Throwable, Seq[A]]] = {

    if (!(previousFetch.hasNext && acc.size < limit)) {
      return IO.pure(Ior.Right(acc))
    }
    if (previousFetch.getRateLimitStatus.getRemaining <= 0) {
      return IO.pure(Ior.Both(new TwitterException("rate limit exceeded"), acc))
    }

    for (
      fetch <- doFetch(previousFetch.getNextCursor).attempt;
      merged <- fetch match {
        case Left(e)  => IO.pure(Ior.Both(e, acc))
        case Right(p) => fetchMore(acc ++ extractValues(p), p, limit)
      }
    ) yield merged
  }

  private def tapLog(apiRes: ApiRes): IO[ApiRes] = {
    logger.debug(
      s"twitter {} rate limit: {} / {}. resetting in {} seconds.",
      apiTag,
      apiRes.getRateLimitStatus.getRemaining,
      apiRes.getRateLimitStatus.getLimit,
      apiRes.getRateLimitStatus.getSecondsUntilReset,
    )
    IO.pure(apiRes)
  }
}
