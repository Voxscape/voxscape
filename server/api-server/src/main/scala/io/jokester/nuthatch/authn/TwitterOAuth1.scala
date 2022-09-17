package io.jokester.nuthatch.authn

import cats.effect.IO
import com.github.scribejava.core.model.OAuth1AccessToken
import com.google.gson.Gson
import twitter4j.auth.AccessToken
import twitter4j.conf.ConfigurationBuilder
import twitter4j.{Twitter, TwitterFactory, User => TwitterUser}
import io.jokester.nuthatch.consts._

private[authn] trait TwitterOAuth1 extends BaseAuth { self: AuthenticationService =>

  private lazy val twitterOAuth1Config = apiCtx.rootConfig.getConfig("twitter_oauth1")

  private lazy val twitterOAuth1: TwitterOAuth1Flow =
    new TwitterOAuth1Flow(twitterOAuth1Config, apiCtx)

  private val gson = new Gson()

  def startOAuth1Twitter: IO[AuthenticationApi.OAuth1.OAuth1LoginIntent] = {
    twitterOAuth1.issueTwitterOAuthUrl().map(AuthenticationApi.OAuth1.OAuth1LoginIntent)
  }

  def buildTwitterEmail(twitterUser: TwitterUser): String = Option(twitterUser.getEmail)
    .map(_.toLowerCase)
    .getOrElse(s"oauth1:twitter_id=${twitterUser.getId}:${TempEmail.placeholderSuffix}")

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
    ) yield u.asCurrentUser()
  }

  def upsertUser(
      twitterUser: TwitterUser,
      token: OAuth1AccessToken,
  ): IO[UserWithAuth] = {

    val twitterEmail = buildTwitterEmail(twitterUser)

    for (
      oauthMatch <- findUserByOAuth(
        OAuth1Provider.twitter,
        Option(twitterUser.getId).map(_.toString).get,
      );
      emailMatch <- findUserByEmail(twitterEmail);
      userId <- upsertOAuthUser(
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
      );
      reloaded <- findUserById(userId)
    ) yield reloaded.get
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
