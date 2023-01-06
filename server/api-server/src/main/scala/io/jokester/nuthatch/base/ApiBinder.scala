package io.jokester.nuthatch.base

import cats.effect.IO
import cats.syntax.either._
import com.typesafe.scalalogging.LazyLogging
import io.jokester.api.OpenAPIConvention.{ApiError, BadRequest, ServerError}
import io.jokester.nuthatch.AppRoot
import io.jokester.nuthatch.authn.AuthenticationApi
import io.jokester.nuthatch.consts._
import org.http4s.HttpRoutes
import sttp.tapir.Endpoint
import sttp.tapir.server.http4s.Http4sServerInterpreter

object ApiBinder extends LazyLogging {

  def apiList: Seq[Endpoint[_, _, _, _, _]] = Seq(
    AuthenticationApi.OAuth1.startAuth,
    AuthenticationApi.OAuth1.finishAuth,
    AuthenticationApi.Password.confirmEmail,
    AuthenticationApi.Password.signUp,
    AuthenticationApi.Password.signUp,
  )

  def buildRoutes(root: AppRoot): HttpRoutes[IO] = {
    val interpreter = Http4sServerInterpreter[IO]()

    val authn = root.authn

    interpreter.toRoutes(
      List(
        // OAuth1
        AuthenticationApi.OAuth1.startAuth.serverLogic {
          case OAuth1Provider.twitter =>
            authn.startOAuth1Twitter.attempt.map(launderServerError)
          case _ => IO.raiseError(BadRequest("unsupported provider"))
        },
        AuthenticationApi.OAuth1.finishAuth.serverLogic { req =>
          {
            req.provider match {
              case OAuth1Provider.twitter =>
                authn
                  .finishOAuth1Twitter(req)
                  .attempt
                  .map(launderServerError)
              case _ => IO.raiseError(BadRequest("unsupported provider"))
            }
          }
        },
        // Password
        AuthenticationApi.Password.signUp.serverLogic(req => {
          authn.emailPasswordSignup(req).map(_.asCurrentUser()).attempt.map(launderServerError)
        }),
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
