package io.jokester.nuthatch

import cats.effect.{ExitCode, IO}
import com.typesafe.scalalogging.LazyLogging
import io.jokester.api.OpenAPIConvention
import io.jokester.nuthatch.consts._
import io.jokester.nuthatch.twitter.TwitterClientService

import scala.concurrent.duration.DurationInt

class Scripts(serviceBundle: AppRoot) extends LazyLogging {
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
        maybeCred <- serviceBundle.authn.loadOAuth1Cred(userId, OAuth1Provider.twitter);
        cred <- maybeCred match {
          case Some(t) => IO.pure(t)
          case _       => IO.raiseError(OpenAPIConvention.NotFound("token not found"))
        };
        twitterClientService = TwitterClientService(
          serviceBundle.apiContext,
          cred.providerUserId.toLong,
          cred.accessToken,
        );
        _        <- IO.sleep(1.seconds);
        fetched  <- twitterClientService.fetchFollowers();
        _        <- IO.sleep(1.seconds);
        timeline <- twitterClientService.fetchTweets()
      ) yield ExitCode.Success

    }

  }

}
