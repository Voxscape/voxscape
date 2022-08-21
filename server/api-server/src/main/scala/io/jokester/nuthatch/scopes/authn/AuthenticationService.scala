package io.jokester.nuthatch.scopes.authn

import cats.effect.IO
import com.github.scribejava.core.model.OAuth1AccessToken
import com.google.gson.Gson
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.infra.ApiContext
import io.jokester.nuthatch.infra.Const.TempEmail
import io.jokester.nuthatch.quill.generated.{public => Public}
import twitter4j.{Twitter, TwitterFactory, User => TwitterUser}
import twitter4j.auth.AccessToken
import twitter4j.conf.ConfigurationBuilder

class AuthenticationService(protected val apiCtx: ApiContext)
    extends TwitterOAuth1
    with LazyLogging {}

private[authn] trait TwitterOAuth1 extends BaseOAuth1 { self: AuthenticationService =>

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
    val existedUser  = findExistedUser(twitterEmail)

    ???
  }

  def getTwitter4J(token: OAuth1AccessToken): Twitter = {
    val factory = new TwitterFactory(
      new ConfigurationBuilder()
        .setOAuthConsumerKey(twitterOAuth1Config.getString("consumer_key"))
        .setOAuthConsumerSecret(twitterOAuth1Config.getString("consumer_secret"))
        .build(),
    )
    factory.getInstance(new AccessToken(token.getToken, token.getTokenSecret))
  }
}

private[authn] trait BaseOAuth1 extends LazyLogging { self: AuthenticationService =>

  def findExistedUser(email: String): IO[Option[(Public.User, Seq[Public.UserOauth1])]] =
    apiCtx.quill.use(publicCtx =>
      IO.blocking({
        import publicCtx._
        val findUser = quote {
          query[Public.User].filter(_.email == lift(email))
        }
        val found: Seq[Public.User] = publicCtx.run(findUser)

        ???
      }),
    )

  def createTempUser(placeholder: String): IO[AuthenticationApi.CurrentUser] = {
    val tempEmail = placeholder + TempEmail.placeholderSuffix

    val a = apiCtx.quill.use(publicCtx => {
      import publicCtx.{quote, query}

      val wtf = ???
      IO.never
    })

    ???
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
