package io.jokester.nuthatch.scopes.authn

import cats.effect.IO
import com.github.scribejava.core.model.OAuth1AccessToken
import com.google.gson.Gson
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.infra.ApiContext

trait AuthenticationService extends TwitterOAuth1 with LazyLogging {
  protected val apiCtx: ApiContext
}
