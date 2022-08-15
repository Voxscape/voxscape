package io.jokester.nuthatch.infra

import io.jokester.nuthatch.scopes.authn.AuthenticationApi
import sttp.tapir.Endpoint

object ApiBinder {

  def apiList: Seq[Endpoint[_, _, _, _, _]] = Seq(
    AuthenticationApi.OAuth1.requestOAuthAuth,
    AuthenticationApi.OAuth1.verifyOAuth1Auth,
    AuthenticationApi.Password.requestPasswordLogin,
    AuthenticationApi.Password.requestPasswordSignUp,
  )

}
