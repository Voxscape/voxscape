package io.jokester.http4s

import cats.effect.IO
import com.typesafe.scalalogging.LazyLogging
import org.http4s.{HttpRoutes, Response, Status}

object VerboseLogger extends LazyLogging {
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
