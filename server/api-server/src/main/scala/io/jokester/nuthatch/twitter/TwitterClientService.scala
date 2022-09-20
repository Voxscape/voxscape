package io.jokester.nuthatch.twitter

import cats.data.Ior
import cats.data.Ior.Both
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

}
