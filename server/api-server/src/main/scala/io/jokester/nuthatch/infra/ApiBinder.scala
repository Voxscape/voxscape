package io.jokester.nuthatch.infra

import cats.effect.IO
import cats.syntax.either._
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.scopes.authn.{AuthenticationApi, AuthenticationService}
import org.http4s.HttpRoutes
import sttp.tapir.Endpoint
import sttp.tapir.server.http4s.Http4sServerInterpreter
import io.jokester.api.OpenAPIConvention._

object ApiBinder extends LazyLogging {

  def apiList: Seq[Endpoint[_, _, _, _, _]] = Seq(
    AuthenticationApi.OAuth1.requestOAuthAuth,
    AuthenticationApi.OAuth1.verifyOAuth1Auth,
    AuthenticationApi.Password.requestPasswordLogin,
    AuthenticationApi.Password.requestPasswordSignUp,
  )

  def buildRoutes(authn: AuthenticationService): HttpRoutes[IO] = {
    val interpreter = Http4sServerInterpreter[IO]()

    interpreter.toRoutes(
      List(
        // OAuth1
        AuthenticationApi.OAuth1.requestOAuthAuth.serverLogic {
          case "twitter_oauth1" =>
            authn.requestTwitterOAuthLogin.attempt.map(launderServerError)
          case _ => IO.raiseError(BadRequest("unsupported provider"))
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
