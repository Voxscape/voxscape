package io.jokester.nuthatch.twitter

import cats.effect.IO
import com.github.scribejava.core.model.OAuth1AccessToken
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.base.AppContextBase
import twitter4j.Twitter

case class TwitterClientService(appCtx: AppContextBase, accessToken: OAuth1AccessToken)
    extends LazyLogging {

  private def client =
    appCtx.providers.twitter.twitterClient(accessToken.getToken, accessToken.getTokenSecret)

  def fetchOwnId: IO[Long] = useClient(_.verifyCredentials().getId)

  private def useClient[A](f: Twitter => A): IO[A] = client.use(t => IO(f(t)))

  def fetchFollowers(): IO[Unit] = {
    for (
      ownId     <- fetchOwnId;
      followers <- useClient(_.getFollowersList(ownId, -1))
    ) yield {

      logger.debug("got followers {}", followers.toArray.toSeq)
    }
  }

  def fetchTweets(): IO[Unit] = {
    for (tweets <- useClient(_.getUserTimeline)) yield {
      logger.debug("got tweets: {}", tweets.toArray.toSeq)
    }

  }

}
