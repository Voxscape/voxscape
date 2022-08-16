package io.jokester.nuthatch.scopes.authn

import cats.effect.IO
import io.jokester.nuthatch.infra.ApiContext

class AuthenticationService(val ctx: ApiContext) extends OAuth1Authn {}

private[authn] trait OAuth1Authn { self: AuthenticationService =>

  private lazy val twitterOAuth1: TwitterOAuth1Flow =
    new TwitterOAuth1Flow(ctx.rootConfig.getConfig("twitter_oauth1"), ctx)

  def requestTwitterOAuthLogin: IO[AuthenticationApi.OAuth1.OAuth1LoginIntent] = {
    twitterOAuth1.issueTwitterOAuthUrl().map(AuthenticationApi.OAuth1.OAuth1LoginIntent)
  }
}
