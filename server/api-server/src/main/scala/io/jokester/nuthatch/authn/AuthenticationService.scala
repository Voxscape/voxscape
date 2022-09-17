package io.jokester.nuthatch.authn

import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.base.AppContext

trait AuthenticationService extends TwitterOAuth1 with OAuthTokenProvider with LazyLogging {
  protected val apiCtx: AppContext
}
