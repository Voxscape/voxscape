package io.jokester.nuthatch.scopes.authn

import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.infra.ApiContext

trait AuthenticationService extends TwitterOAuth1 with OAuthTokenProvider with LazyLogging {
  protected val apiCtx: ApiContext
}
