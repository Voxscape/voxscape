package io.jokester.nuthatch.authn

import cats.effect.IO
import com.github.scribejava.core.model.OAuth1AccessToken
import com.google.gson.Gson
import io.jokester.nuthatch.consts._
import twitter4j.auth.AccessToken
import twitter4j.{Twitter, User => TwitterUser}

private[authn] trait TwitterOAuth1 { self: BaseAuth =>

  private lazy val twitterOAuth1: TwitterOAuth1Flow =
    new TwitterOAuth1Flow(appCtx)

  private val gson = new Gson()

  def startOAuth1Twitter: IO[AuthenticationApi.OAuth1.OAuth1LoginIntent] = {
    twitterOAuth1.issueTwitterOAuthUrl().map(AuthenticationApi.OAuth1.OAuth1LoginIntent)
  }

  def buildTwitterEmail(twitterUser: TwitterUser): String = Option(twitterUser.getEmail)
    .map(_.toLowerCase)
    .getOrElse(TempEmail.oauth1DummyEmail(OAuth1Provider.twitter, twitterUser.getId.toString))

  def finishOAuth1Twitter(
      cred: AuthenticationApi.OAuth1.OAuth1TempCred,
  ): IO[AuthenticationApi.CurrentUser] = {
    for (
      token <- twitterOAuth1.exchangeToken(cred.oauthToken, cred.oauthVerifier);
      _     <- IO { logger.debug("got token: {}", new Gson().toJson(token)) };
      twitterUser <- appCtx.providers.twitter
        .twitterClient(token.getToken, token.getTokenSecret)
        .use(c => IO(c.verifyCredentials()));
      _ <- IO {
        logger.debug("got user: {} / {}", gson.toJson(twitterUser), twitterUser.isVerified)
      };
      u <- upsertUser(twitterUser, token)
    ) yield u.asCurrentUser()
  }

  def upsertUser(
      twitterUser: TwitterUser,
      token: OAuth1AccessToken,
  ): IO[UserAuthBundle] = {

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
        appCtx.quill.dummyUser.copy(
          email = twitterEmail,
        ),
        appCtx.quill.dummyOAuth1.copy(
          provider = OAuth1Provider.twitter,
          accessToken = token.getToken,
          accessTokenSecret = token.getTokenSecret,
          providerId = twitterUser.getId.toString,
          providerProfile = appCtx.quill.toJson(twitterUser),
        ),
      );
      reloaded <- findUserById(userId)
    ) yield reloaded.get
  }

}
