package io.jokester.nuthatch

import com.typesafe.config.Config
import io.jokester.nuthatch.authn.AuthenticationService
import io.jokester.nuthatch.base.{AppContext, AppContextBase}
import io.jokester.nuthatch.twitter.TwitterStorageService

object AppRoot {
  def build(rootConfig: Config): AppRoot = {
    val apiContext = AppContext.buildDefault(rootConfig)
    new AppRoot(apiContext)
  }
}

final class AppRoot(val apiContext: AppContextBase) {
  val authn: AuthenticationService = new AuthenticationService {
    protected override val appCtx: AppContextBase = apiContext
  }

  object twitter {
    val storage: TwitterStorageService = new TwitterStorageService(apiContext)
  }
}
