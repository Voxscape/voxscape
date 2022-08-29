package io.jokester.nuthatch.infra

import cats.effect.{Clock, IO}
import cats.syntax.either._
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.scopes.authn.{AuthenticationApi, AuthenticationService}
import org.http4s.HttpRoutes
import sttp.tapir.Endpoint
import sttp.tapir.server.http4s.Http4sServerInterpreter
import io.jokester.api.OpenAPIConvention._

object ApiBinder extends LazyLogging {

  def apiList: Seq[Endpoint[_, _, _, _, _]] = Seq(
    AuthenticationApi.OAuth1.startAuth,
    AuthenticationApi.OAuth1.finishAuth,
    AuthenticationApi.Password.requestPasswordLogin,
    AuthenticationApi.Password.requestPasswordSignUp,
  )

  def buildRoutes(authn: AuthenticationService): HttpRoutes[IO] = {
    val interpreter = Http4sServerInterpreter[IO]()

    interpreter.toRoutes(
      List(
        // OAuth1
        AuthenticationApi.OAuth1.startAuth.serverLogic {
          case Const.OAuth1Provider.twitter =>
            authn.startOAuth1Twitter.attempt.map(launderServerError)
          case _ => IO.raiseError(BadRequest("unsupported provider"))
        },
        AuthenticationApi.OAuth1.finishAuth.serverLogic { req =>
          {
            req.provider match {
              case Const.OAuth1Provider.twitter =>
                authn
                  .finishOAuth1Twitter(req)
                  .attempt
                  .map(launderServerError)
              case _ => IO.raiseError(BadRequest("unsupported provider"))
            }
          }
        },
        // Password
      ),
    )

  }

  def launderServerError[A](e: Either[Throwable, A]): Either[ApiError, A] = {
    e.leftMap({
      case t: ApiError => t
      case t =>
        logger.info("server error", t)
        ServerError("error happened")
    })
  }
}
