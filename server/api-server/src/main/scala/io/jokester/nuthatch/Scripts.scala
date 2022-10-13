package io.jokester.nuthatch

import cats.data.Ior
import cats.effect.{ExitCode, IO}
import com.typesafe.scalalogging.LazyLogging
import io.jokester.api.OpenAPIConvention
import io.jokester.nuthatch.consts._
import io.jokester.nuthatch.twitter.TwitterClientService

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
        followers <- twitterClientService.fetchFollowers();
        _ <- serviceBundle.twitter.storage.upsertFollowers(
          userId,
          followers.getOrElse(Seq.empty).map(_.getId),
        );
        _ <- IO {
          followers match {
            case Ior.Left(a)  => logger.error("fetchFollower failed", a)
            case Ior.Right(b) => logger.info("fetchFollowers succeeded: {} followers", b.length)
            case Ior.Both(a, b) =>
              logger.info("fetchFollowers partially succeeded: {} followers / {}", b.length, a)
          }
        };
        _       <- serviceBundle.twitter.storage.upsertUsers(followers.getOrElse(Seq.empty));
        friends <- twitterClientService.fetchFriends();
        _ <- IO {
          friends match {
            case Ior.Left(a)  => logger.error("fetchFriends failed", a)
            case Ior.Right(b) => logger.info("fetchFriends succeeded: {} friends", b.length)
            case Ior.Both(a, b) =>
              logger.info("fetchFriends partially succeeded: {} friends / {}", b.length, a)
          }
        };
        _ <- serviceBundle.twitter.storage.upsertUsers(friends.getOrElse(Seq.empty))
      ) yield ExitCode.Success

    }

  }

}
