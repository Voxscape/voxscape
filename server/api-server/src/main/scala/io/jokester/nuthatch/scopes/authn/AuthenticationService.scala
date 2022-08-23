package io.jokester.nuthatch.scopes.authn

import cats.effect.IO
import com.github.scribejava.core.model.OAuth1AccessToken
import com.google.gson.Gson
import com.typesafe.scalalogging.LazyLogging
import io.getquill.{EntityQuery, Quoted}
import io.jokester.nuthatch.infra.ApiContext
import io.jokester.nuthatch.infra.Const.{OAuth1Provider, TempEmail}
import io.jokester.nuthatch.quill.QuillJsonHelper
import io.jokester.nuthatch.quill.generated.{public => T}
import twitter4j.{Twitter, TwitterFactory, User => TwitterUser}
import twitter4j.auth.AccessToken
import twitter4j.conf.ConfigurationBuilder

class AuthenticationService(protected val apiCtx: ApiContext)
    extends TwitterOAuth1
    with LazyLogging {}

private[authn] trait TwitterOAuth1 extends BaseAuth { self: AuthenticationService =>

  private lazy val twitterOAuth1Config = apiCtx.rootConfig.getConfig("twitter_oauth1")

  private lazy val twitterOAuth1: TwitterOAuth1Flow =
    new TwitterOAuth1Flow(twitterOAuth1Config, apiCtx)

  private val gson = new Gson()

  def startOAuth1Twitter: IO[AuthenticationApi.OAuth1.OAuth1LoginIntent] = {
    twitterOAuth1.issueTwitterOAuthUrl().map(AuthenticationApi.OAuth1.OAuth1LoginIntent)
  }

  def buildTwitterEmail(twitterUser: TwitterUser): String = Option(twitterUser.getEmail)
    .getOrElse(s"twitterId=${twitterUser.getId}:${TempEmail.placeholderSuffix}")

  def finishOAuth1Twitter(
      cred: AuthenticationApi.OAuth1.OAuth1TempCred,
  ): IO[AuthenticationApi.CurrentUser] = {
    for (
      token       <- twitterOAuth1.exchangeToken(cred.oauthToken, cred.oauthVerifier);
      _           <- IO { logger.debug("got token: {}", new Gson().toJson(token)) };
      twitterUser <- IO.blocking(getTwitter4J(token).verifyCredentials());
      _ <- IO {
        logger.debug("got user: {} / {}", gson.toJson(twitterUser), twitterUser.isVerified)
      };
      u <- upsertUser(twitterUser, token)
    ) yield ???
  }

  def upsertUser(
      twitterUser: TwitterUser,
      token: OAuth1AccessToken,
  ): IO[AuthenticationApi.CurrentUser] = {

    val twitterEmail = buildTwitterEmail(twitterUser)

    for (
      oauthMatch <- findUserByOAuth(
        OAuth1Provider.twitter,
        Option(twitterUser.getId).map(_.toString).get,
      );
      emailMatch <- findUserByEmail(twitterEmail);
      upserted <- upsertOAuthUser(
        oauthMatch,
        emailMatch,
        apiCtx.quill.dummyUser.copy(
          email = twitterEmail,
        ),
        apiCtx.quill.dummyOAuth1.copy(
          provider = OAuth1Provider.twitter,
          accessToken = token.getToken,
          accessTokenSecret = token.getTokenSecret,
          providerId = twitterUser.getId.toString,
          providerProfile = apiCtx.quill.toJson(twitterUser),
        ),
      )
    ) yield upserted
    val existedUser = findUserByEmail(twitterEmail)

    ???
  }

  private def getTwitter4J(token: OAuth1AccessToken): Twitter = {
    val factory = new TwitterFactory(
      new ConfigurationBuilder()
        .setOAuthConsumerKey(twitterOAuth1Config.getString("consumer_key"))
        .setOAuthConsumerSecret(twitterOAuth1Config.getString("consumer_secret"))
        .build(),
    )
    factory.getInstance(new AccessToken(token.getToken, token.getTokenSecret))
  }
}

private[authn] trait BaseAuth extends LazyLogging with QuillJsonHelper {
  self: AuthenticationService =>

  private lazy val quill = self.apiCtx.quill

  /** @internal
    */
  case class UserWithAuth(
      user: T.User,
      userOAuth1: Seq[T.UserOauth1],
  ) {
    def findByProvider(provider: String): Option[T.UserOauth1] = {
      userOAuth1.find(_.provider == provider)
    }

  }

  private def insertX(userId: Int): Quoted[EntityQuery[T.User]] = {
    import quill._
    quote {
      query[T.User].filter(_.id == lift(userId))
    }
  }

  def findUserByEmail(email: String): IO[Option[UserWithAuth]] = {
    val findIdByEmail: IO[Option[Int]] = IO.blocking {
      import quill._
      val users: Seq[T.User] = run {
        query[T.User]
          .filter(_.email == lift(email))
      }
      users.headOption.map(_.id)
    }
    findIdByEmail.flatMap({
      case Some(userId) => findUserById(userId)
      case _            => IO.pure(None)
    })
  }

  def findUserById(userId: Int): IO[Option[UserWithAuth]] = IO.blocking {
    import quill._
    val findUser = quote {
      query[T.User]
        .filter(_.id == lift(userId))
        .leftJoin(query[T.UserOauth1])
        .on((user, userOauth) => user.id == userOauth.userId)
    }
    val found: Seq[(T.User, Option[T.UserOauth1])] = run(findUser)

    found.headOption match {
      case Some(row) => Some(UserWithAuth(row._1, found.flatMap(_._2)))
      case _         => None
    }
  }

  def findUserByOAuth(provider: String, externalId: String): IO[Option[UserWithAuth]] = {

    val search: IO[Option[T.User]] = IO.blocking {
      import quill._

      val matched: Seq[(T.UserOauth1, T.User)] = run(quote {
        query[T.UserOauth1]
          .filter(r => r.provider == lift(provider) && r.providerId == lift(externalId))
          .join(query[T.User])
          .on((oauth, user) => oauth.userId == user.id)
      })
      matched.headOption.map(_._2)
    }
    search.flatMap({
      case Some(found) => findUserById(found.id)
      case _           => IO.pure(None)
    })

  }

  def upsertOAuthUser(
      oauthMatch: Option[UserWithAuth],
      emailMatch: Option[UserWithAuth],
      initialUser: T.User,
      initialOauth: T.UserOauth1,
  ): IO[Int] = {
    IO.blocking({
      import quill._

      val insertUser = quote {
        query[T.User]
          .insert(_.email -> lift(initialUser.email), _.profile -> lift(initialUser.profile))
          .returning(u => u.id)
      }
      val insertOAuth = (userId: Int) =>
        quote {
          query[T.UserOauth1]
            .insert(
              _.userId            -> lift(userId),
              _.provider          -> lift(initialOauth.provider),
              _.providerId        -> lift(initialOauth.providerId),
              _.providerProfile   -> lift(initialOauth.providerProfile),
              _.accessToken       -> lift(initialOauth.accessToken),
              _.accessTokenSecret -> lift(initialOauth.accessTokenSecret),
            )
        }

      val updateOAuth = (existed: T.UserOauth1, patch: T.UserOauth1) =>
        quote {
          query[T.UserOauth1]
            .filter(_.id == lift(existed.id))
            .update(
              _.providerProfile   -> lift(patch.providerProfile),
              _.accessToken       -> lift(patch.accessToken),
              _.accessTokenSecret -> lift(patch.accessTokenSecret),
            )
        }

      val userId = (oauthMatch, emailMatch) match {
        // existing user with email + OAuth profile: update the OAuth part
        case (Some(m1), Some(m2)) if m1.user.id == m2.user.id =>
          run(updateOAuth(m1.findByProvider(initialOauth.provider).get, initialOauth))
          m1.user.id
        // existed user with only OAuth profile
        case (Some(m1), None) =>
          run(updateOAuth(m1.findByProvider(initialOauth.provider).get, initialOauth))
          m1.user.id
        // existed user without oauth profile: create the OAuth part
        case (None, Some(m2)) =>
          run(insertOAuth(m2.user.id))
          m2.user.id
        // new user
        case (None, None) =>
          transaction {
            val newUserId = run(insertUser)
            run(insertOAuth(newUserId))
            newUserId
          }
        //
        case _ => throw new AssertionError("user profile mismatch")
      }
      userId
    })
  }
}

private[authn] trait PasswordAuthn { self: AuthenticationService =>

  def attemptSignup(
      cred: AuthenticationApi.Password.EmailSignUpRequest,
  ): IO[AuthenticationApi.CurrentUser] = ???

  def attemptLogin(
      cred: AuthenticationApi.Password.EmailLoginCred,
  ): IO[AuthenticationApi.CurrentUser] = ???

  def completeEmailActivation(
      cred: AuthenticationApi.Password.EmailLoginCred,
      token: String,
  ): IO[AuthenticationApi.CurrentUser] = ???
}
