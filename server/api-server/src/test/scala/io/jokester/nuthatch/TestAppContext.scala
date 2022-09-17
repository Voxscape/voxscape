package io.jokester.nuthatch

import com.typesafe.config.{Config, ConfigFactory}
import io.jokester.nuthatch.base.AppContext
import io.jokester.nuthatch.generated.quill.{public => T}

object TestAppContext {
  def build(): AppContext with TestHelper = {
    new AppContext with TestHelper {
      override def rootConfig: Config = ConfigFactory.load()
      logger.debug("got rootConfig: {}", rootConfig)

      override def redisConfig: Config = rootConfig.getConfig("test.redis")

      override def postgresConfig: Config = rootConfig.getConfig("test.postgres")
    }

  }

  trait TestHelper { self: AppContext =>

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
