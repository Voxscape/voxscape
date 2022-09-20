package io.jokester.nuthatch.twitter

import cats.data.Ior
import cats.data.Ior.Both
import cats.effect.IO

case class TwitterFetcher[A <: twitter4j.TwitterResponse](
    private val fetchPage: Long => IO[twitter4j.PagableResponseList[A]],
) {
  Both
  def fetchAll(): IO[Ior[Throwable, Seq[A]]] = {
    for (
      firstPage <- fetchPage(0).attempt;
      merged <- firstPage match {
        case Left(e)  => IO.pure(Ior.Left(e))
        case Right(p) => fetchMore(Seq.empty, p)
      }
    ) yield merged
  }

  private def fetchMore(
      acc: Seq[A],
      prev: twitter4j.PagableResponseList[A],
  ): IO[Ior[Throwable, Seq[A]]] = {
    // TODO: we can consume prev.status
    val c: Seq[A] = ???
    if (!prev.hasNext()) {
      return IO.pure(Ior.Right(acc ++ c))
    } else {
      for (
        nextPage <- fetchPage(1).attempt;
        merged <- nextPage match {
          case Left(e)  => IO.pure(Ior.Both(e, acc))
          case Right(p) => fetchMore(acc ++ c, p)
        }
      ) yield merged
    }
  }

}
