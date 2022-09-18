package io.jokester.nuthatch.base

import com.typesafe.config.{Config, ConfigFactory}
import io.jokester.nuthatch.generated.quill.{public => T}

object TestAppContext {
  def build(): AppContext with TestHelper = {
    new AppContext with TestHelper {
      self =>
      override def rootConfig: Config = ConfigFactory.load()

      logger.debug("got rootConfig: {}", rootConfig)

      override def redisConfig: Config = rootConfig.getConfig("test.redis")

      override def postgresConfig: Config = rootConfig.getConfig("test.postgres")

      override object web extends WebConfig {
        protected override val siteConfig: Config = rootConfig.getConfig("site")
      }

      override object providers extends Providers {
        protected override val rootConfig: Config = self.rootConfig
      }
    }
  }

  trait TestHelper {
    self: AppContext =>

    def cleanDb(): Unit = {
      import quill._

      transaction {
        run(query[T.UserOauth1].delete)
        run(query[T.UserPassword].delete)
        run(query[T.User].delete)
      }

    }

  }
}
