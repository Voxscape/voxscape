package io.jokester.nuthatch.scopes.authn

import cats.effect.IO
import io.jokester.nuthatch.infra.ApiContext
import io.jokester.nuthatch.quill.generated.public.UserOauth1Token

class AuthenticationService(val ctx: ApiContext) extends OAuth1Authn {}

private[authn] trait OAuth1Authn { self: AuthenticationService =>

  private lazy val twitterOAuth1: TwitterOAuth1Flow =
    new TwitterOAuth1Flow(ctx.rootConfig.getConfig("twitter_oauth1"), ctx)

  def requestTwitterOAuthLogin: IO[AuthenticationApi.OAuth1.OAuth1LoginIntent] = {
    twitterOAuth1.issueTwitterOAuthUrl().map(AuthenticationApi.OAuth1.OAuth1LoginIntent)
  }

  def finishTwitterOAuthLogin(
      cred: AuthenticationApi.OAuth1.OAuth1TempCred,
  ): IO[(AuthenticationApi.CurrentUser, UserOauth1Token)] = {
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
