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

  def syncFollowers(): IO[Unit] = client.use(c => fetchFollowers(0, c))

  def fetchFollowers(userId: Long, client: Twitter): IO[Unit] = {
    for (
      ownId     <- IO(client.getId);
      followers <- IO(client.getFollowersList(ownId, 0))
    ) yield {

      logger.debug("got followers {}", followers)
    }
  }

  def fetchTweets(): IO[Unit] = {
    for (
      _c <- client.allocated;
      (client, release) = _c;
      tweets <- IO(client.getUserTimeline)
    ) yield {
      logger.debug("got tweets: {}", Seq.empty)

    }

  }

}
