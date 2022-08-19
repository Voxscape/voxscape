package io.jokester.http4s

import cats.{Applicative, FlatMap}
import cats.effect.IO
import com.typesafe.scalalogging.LazyLogging
import org.http4s.{HttpRoutes, Request, Response, Status}

object VerboseLogger extends LazyLogging {
  def logRequest[F[_]: Applicative](req: Request[F]): F[Request[F]] = {
    Applicative[F].pure({
      logger.debug("request: {} {}", req.method, req.uri)
      req
    })
  }
  def logReqRes[F[_]: FlatMap](req: Request[F], res: Response[F]): Response[F] = {
    logger.debug("request: {} {} / {}", req.method, req.uri, res.status)
    res
  }
  val httpMiddleware: org.http4s.server.HttpMiddleware[IO] =
    origHandler =>
      origHandler.tapWith((req, res) => {
        logger.debug("request: {} {} / {}", req.method, req.uri, res.status)
        res
      })

  val notFound: HttpRoutes[IO] = HttpRoutes.of[IO] { req =>
    logger.debug("request: {} {}", req.method, req.uri)
    IO.pure(Response[IO](status = Status.NotFound))
  }
}
