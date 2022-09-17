package io.jokester.nuthatch

import cats.effect.{ExitCode, IO}
import com.github.scribejava.core.model.OAuth1AccessToken
import com.typesafe.scalalogging.LazyLogging
import io.jokester.api.OpenAPIConvention
import io.jokester.nuthatch.infra.{Const, ServiceBundle}
import io.jokester.nuthatch.scopes.twitter.TwitterClientService

class Scripts(serviceBundle: ServiceBundle) extends LazyLogging {
  def runScript(command: List[String]): IO[ExitCode] = {
    logger.debug("interpreting script command: {}", command)
    command match {
      case List("fetchTwitterFollower", uidString) =>
        FetchTwitterFollower(uidString.toInt).run
      case _ =>
        IO {
          logger.error("unknown command: {}", command)
          ExitCode.Error
        }
    }
  }

  private def todo(task: String, rest: String*): IO[ExitCode] = IO {
    logger.debug("TODO: implement {}({})", task, rest.mkString(", "))
    ExitCode.Error
  }

  private case class FetchTwitterFollower(userId: Int) {
    def run: IO[ExitCode] = {
      for (
        maybeToken <- serviceBundle.authn.loadOAuth1Token(userId, Const.OAuth1Provider.twitter);
        token <- maybeToken.fold[IO[OAuth1AccessToken]](
          IO.raiseError(OpenAPIConvention.NotFound("token not found")),
        )(IO.pure);
        fetched <- TwitterClientService(token).fetchFollowers()
      ) yield ExitCode.Success

    }

  }

}
