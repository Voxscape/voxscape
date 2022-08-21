package io.jokester.nuthatch.scopes.authn

import cats.effect.IO
import com.github.scribejava.core.model.OAuth1AccessToken
import com.google.gson.Gson
import com.typesafe.scalalogging.LazyLogging
import io.circe.Json
import io.jokester.nuthatch.infra.ApiContext
import io.jokester.nuthatch.infra.Const.TempEmail
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
    val existedUser  = findUserForAuth(twitterEmail)

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

private[authn] trait BaseAuth extends LazyLogging { self: AuthenticationService =>

  private lazy val quill = self.apiCtx.quill

  case class UserWithAuth(user: T.User, userOAuth1: Seq[T.UserOauth1])

  def findUserForAuth(email: String): IO[Option[UserWithAuth]] =
    IO.blocking({
      import quill._
      val findUser = quote {
        query[T.User]
          .filter(_.email == lift(email))
          .leftJoin(query[T.UserOauth1])
          .on((user, userOauth) => user.id == userOauth.userId)
      }
      val found: Seq[(T.User, Option[T.UserOauth1])] = run(findUser)

      found.headOption match {
        case Some(row) => Some(UserWithAuth(row._1, found.flatMap(_._2)))
        case _         => None
      }
    })

  def createUserFromOAuth(email: String, initialProfile: Option[Json] = None, oauth: T.UserOauth1): IO[UserWithAuth] = {
    IO.blocking({
      import quill._

      val insertUser = quote {
        (query[T.User].insert(_.email -> lift(email), _.profile -> lift(initialProfile)).returning(u => u.id))
      }
      val created = transaction {
        val newUser = run(insertUser)

        /*
        val newOAuth1 = run(
          query[T.UserOauth1].insert(
            _.userId            -> newUser,
            _.providerId        -> oauth.providerId,
            _.accessToken       -> oauth.accessToken,
            _.accessTokenSecret -> oauth.accessTokenSecret,
            _.providerProfile   -> oauth.providerProfile,
          ),
        )
        */
      }

      ???
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
