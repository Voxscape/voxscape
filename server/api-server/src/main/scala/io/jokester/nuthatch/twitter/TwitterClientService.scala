package io.jokester.nuthatch.twitter

import cats.data.Ior
import cats.effect.IO
import com.github.scribejava.core.model.OAuth1AccessToken
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.base.AppContextBase
import twitter4j.{Twitter, User => TwitterUser}

/** use cases as a twitter user
  */
case class TwitterClientService(
    appCtx: AppContextBase,
    twitterUserId: Long,
    accessToken: OAuth1AccessToken,
) extends LazyLogging {

  private def client =
    appCtx.providers.twitter.twitterClient(accessToken.getToken, accessToken.getTokenSecret)

  /** only use when user id is not known this is a rate-limited API
    */
  private def fetchOwnId: IO[Long] = useClient(_.verifyCredentials().getId)

  private def useClient[A](f: Twitter => A): IO[A] = client.use(t => IO(f(t)))

  def fetchFollowers(): IO[Ior[Throwable, Seq[TwitterUser]]] = {
    val fetcher =
      TwitterFetcher[TwitterUser](cursor => useClient(_.getFollowersList(twitterUserId, cursor)))
    fetcher.fetchAll()
  }

  def fetchFriends(): IO[Unit] = {
    for (friends <- useClient(_.getFriendsList(twitterUserId, -1))) yield {
      logger.debug("got {} friends", friends.size)
    }
  }

  def fetchTweets(): IO[Unit] = {
    for (tweets <- useClient(_.getUserTimeline)) yield {
      logger.debug("got tweets: {}", tweets.toArray.toSeq)
    }

  }

}
