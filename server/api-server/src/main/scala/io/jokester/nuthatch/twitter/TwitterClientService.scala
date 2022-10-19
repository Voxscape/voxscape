package io.jokester.nuthatch.twitter

import cats.data.Ior
import cats.effect.IO
import com.typesafe.scalalogging.LazyLogging
import twitter4j.Twitter
import twitter4j.v1.{User => TwitterUser, IDs, PagableResponseList}

import scala.jdk.CollectionConverters.CollectionHasAsScala

/** use cases as a twitter user
  */
case class TwitterClientService(
    client: Twitter,
) extends LazyLogging {

  /** @deprecated
    *   only use when user id is not known: this is rate-limited too
    */
  private def fetchOwnId: IO[Long] = useClient(_.v1.users.verifyCredentials.getId)

  private def useClient[A](f: Twitter => A): IO[A] = IO { f(client) }

  def fetchFollowers(followeeUserId: Long): IO[Ior[Throwable, Seq[TwitterUser]]] = {
    val fetcher = followerFetcher(followeeUserId)
    fetcher.fetchAll()
  }

  def fetchFollowerIds(followeeUserId: Long): IO[Ior[Throwable, Seq[Long]]] = {
    followerIdFetcher(followeeUserId).fetchAll()
  }

  def fetchFriends(followerUserId: Long): IO[Ior[Throwable, Seq[TwitterUser]]] = {
    friendFetcher(followerUserId).fetchAll()
  }

  private def followerIdFetcher(twitterUserId: Long): TwitterFetcher[Long] = {
    new TwitterFetcher[Long] {
      override type ApiRes = twitter4j.v1.IDs

      override def extractValues(apiRes: IDs): Seq[Long] = apiRes.getIDs.toSeq

      override def doFetch(cursor: Long): IO[IDs] = useClient(
        _.v1.friendsFollowers().getFollowersIDs(twitterUserId, cursor, 5000),
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
        _.v1.friendsFollowers().getFollowersList(twitterUserId, cursor, 200),
      )

      override val apiTag: String = "followers"
    }
  }

  private def friendFetcher(twitterUserId: Long): TwitterFetcher[TwitterUser] = {
    new TwitterFetcher[TwitterUser] {
      override type ApiRes = PagableResponseList[TwitterUser]

      override def doFetch(cursor: Long): IO[ApiRes] = useClient(
        _.v1.friendsFollowers.getFriendsList(twitterUserId, cursor, 200),
      )

      override def extractValues(apiRes: ApiRes): Seq[TwitterUser] = apiRes.asScala.toSeq

      override val apiTag: String = "friends"
    }

  }

}
