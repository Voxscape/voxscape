package io.jokester.nuthatch.twitter

import cats.data.Ior
import cats.effect.IO
import com.typesafe.scalalogging.LazyLogging
import twitter4j.TwitterException

import scala.jdk.CollectionConverters._

case class TwitterFetcher[A <: twitter4j.TwitterResponse](
    fetchPage: Long => IO[twitter4j.PagableResponseList[A]],
) extends LazyLogging {
  def fetchAll(): IO[Ior[Throwable, Seq[A]]] = fetchHead(Int.MaxValue)

  def fetchHead(limit: Int): IO[Ior[Throwable, Seq[A]]] = {
    for (
      firstPage <- fetchPage(-1).attempt;
      merged <- firstPage match {
        case Left(e)  => IO.pure(Ior.Left(e))
        case Right(p) => fetchMore(p.asScala.toSeq, p, limit)
      }
    ) yield merged
  }

  private def fetchMore(
      acc: Seq[A],
      previousFetch: twitter4j.PagableResponseList[A],
      limit: Int,
  ): IO[Ior[Throwable, Seq[A]]] = {

    if (!(previousFetch.hasNext && acc.size < limit)) {
      return IO.pure(Ior.Right(acc))
    }
    if (previousFetch.getRateLimitStatus.getRemaining <= 0) {
      return IO.pure(Ior.Both(new TwitterException("rate limit exceeded"), acc))
    }

    for (
      fetch <- fetchPage(previousFetch.getNextCursor).attempt;
      merged <- fetch match {
        case Left(e)  => IO.pure(Ior.Both(e, acc))
        case Right(p) => fetchMore(acc ++ p.asScala, p, limit)
      }
    ) yield merged
  }
}
