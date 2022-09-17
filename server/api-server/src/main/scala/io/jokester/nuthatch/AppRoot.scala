package io.jokester.nuthatch

import com.typesafe.config.Config
import io.jokester.nuthatch.authn.AuthenticationService
import io.jokester.nuthatch.base.AppContext

object AppRoot {
  def build(rootConfig: Config): AppRoot = {
    val apiContext = AppContext.buildDefault(rootConfig)
    new AppRoot(apiContext)
  }
}

final class AppRoot(val apiContext: AppContext) {
  val authn = new AuthenticationService {
    protected override val apiCtx: AppContext = apiContext
  }
}
