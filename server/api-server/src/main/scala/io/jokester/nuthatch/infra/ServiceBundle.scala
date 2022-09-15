package io.jokester.nuthatch.infra
import io.jokester.nuthatch.scopes.authn.AuthenticationService
import com.typesafe.config.Config

object ServiceBundle {
  def build(rootConfig: Config): ServiceBundle = {
    val apiContext = ApiContext.buildDefault(rootConfig)
    new ServiceBundle(apiContext)
  }
}

final class ServiceBundle(val apiContext: ApiContext) {
  val authn = new AuthenticationService {
    protected override val apiCtx: ApiContext = apiContext
  }
}
