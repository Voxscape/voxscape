package io.jokester.nuthatch.twitter

import cats.data.Ior
import cats.effect.IO
import cats.effect.kernel.Resource
import com.github.scribejava.core.model.OAuth1AccessToken
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.base.AppContextBase
import twitter4j.{IDs, PagableResponseList, Twitter, User => TwitterUser}

import scala.jdk.CollectionConverters.CollectionHasAsScala

/** use cases as a twitter user
  */
case class TwitterClientService(
    appCtx: AppContextBase,
    twitterUserId: Long,
    accessToken: OAuth1AccessToken,
) extends LazyLogging {

  private def client: Resource[IO, Twitter] =
    appCtx.providers.twitter.twitterClient(accessToken.getToken, accessToken.getTokenSecret)

  /** @deprecated
    *   only use when user id is not known: this is rate-limited too
    */
  private def fetchOwnId: IO[Long] = useClient(_.verifyCredentials().getId)

  private def useClient[A](f: Twitter => A): IO[A] = client.use(t => IO(f(t)))

  def fetchFollowers(): IO[Ior[Throwable, Seq[TwitterUser]]] = {
    val fetcher = followerFetcher(twitterUserId)
    fetcher.fetchAll()
  }

  def fetchFollowerIds(): IO[Ior[Throwable, Seq[Long]]] = {
    idsFetcher(twitterUserId).fetchAll()
  }

  def fetchFriends(): IO[Ior[Throwable, Seq[TwitterUser]]] = {
    friendFetcher(twitterUserId)
      .fetchAll()
  }

  private def idsFetcher(twitterUserId: Long): TwitterFetcher[Long] = {
    new TwitterFetcher[Long] {
      type ApiRes = twitter4j.IDs

      override def extractValues(apiRes: IDs): Seq[Long] = apiRes.getIDs.toSeq

      override def doFetch(cursor: Long): IO[IDs] = useClient(
        _.getFollowersIDs(twitterUserId, cursor, 5000),
      )

      override val apiTag: String = "followers_ids"
    }
  }

  private def followerFetcher(twitterUserId: Long): TwitterFetcher[TwitterUser] = {
    new TwitterFetcher[TwitterUser] {
      override type ApiRes = PagableResponseList[TwitterUser]

      override def extractValues(apiRes: ApiRes): Seq[TwitterUser] =
        apiRes.asScala.toSeq

      override def doFetch(cursor: Long): IO[ApiRes] = useClient(
        _.getFollowersList(twitterUserId, cursor, 200),
      )

      override val apiTag: String = "followers"
    }
  }

  private def friendFetcher(twitterUserId: Long): TwitterFetcher[TwitterUser] = {
    new TwitterFetcher[TwitterUser] {
      override type ApiRes = twitter4j.PagableResponseList[TwitterUser]

      override def doFetch(cursor: Long): IO[ApiRes] = useClient(
        _.getFriendsList(twitterUserId, cursor, 200),
      )

      override def extractValues(apiRes: ApiRes): Seq[TwitterUser] = apiRes.asScala.toSeq

      override val apiTag: String = "friends"
    }

  }

}
