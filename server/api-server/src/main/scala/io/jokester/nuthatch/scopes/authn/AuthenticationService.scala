package io.jokester.nuthatch.scopes.authn

import cats.effect.IO
import com.github.scribejava.core.model.OAuth1AccessToken
import com.google.gson.Gson
import com.typesafe.scalalogging.LazyLogging
import io.github.redouane59.twitter.TwitterClient
import io.github.redouane59.twitter.signature.TwitterCredentials
import io.github.redouane59.twitter.signature.TwitterCredentials.TwitterCredentialsBuilder
import io.jokester.api.OpenAPIConvention.NotImplemented
import io.jokester.nuthatch.infra.ApiContext
import io.jokester.nuthatch.quill.generated.public.UserOauth1Token

class AuthenticationService(val ctx: ApiContext) extends OAuth1Authn with LazyLogging {}

private[authn] trait OAuth1Authn { self: AuthenticationService =>

  private lazy val twitterOAuth1Config = ctx.rootConfig.getConfig("twitter_oauth1")

  private lazy val twitterOAuth1: TwitterOAuth1Flow =
    new TwitterOAuth1Flow(twitterOAuth1Config, ctx)

  def startOAuth1Twitter: IO[AuthenticationApi.OAuth1.OAuth1LoginIntent] = {
    twitterOAuth1.issueTwitterOAuthUrl().map(AuthenticationApi.OAuth1.OAuth1LoginIntent)
  }

  def finishOAuth1Twitter(
      cred: AuthenticationApi.OAuth1.OAuth1TempCred,
  ): IO[AuthenticationApi.CurrentUser] = {
    for (
      token <- twitterOAuth1.exchangeToken(cred.oauthToken, cred.oauthVerifier);
      _     <- IO { logger.debug("got token: {}", new Gson().toJson(token)) };
      u     <- findOrCreateUser(cred, token)
    ) yield ???
  }

  def findOrCreateUser(
      cred: AuthenticationApi.OAuth1.OAuth1TempCred,
      token: OAuth1AccessToken,
  ): IO[AuthenticationApi.CurrentUser] = {
    val client = new TwitterClient(
      TwitterCredentials
        .builder()
        .apiKey(twitterOAuth1Config.getString("consumer_key"))
        .apiSecretKey(twitterOAuth1Config.getString("consumer_secret"))
        .accessToken(token.getToken)
        .accessTokenSecret(token.getTokenSecret)
        .build(),
    )

    val gson = new Gson()

    for (
      userId <- IO.blocking(client.getUserIdFromAccessToken);
      _      <- IO { logger.debug("got userId: {}", userId) };
      user   <- IO.blocking(client.getUserFromUserId(userId));
      _      <- IO { logger.debug("got user: {}", gson.toJson(user)) };
      _      <- IO.raiseError(NotImplemented("TODO"))
    ) yield ???
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
