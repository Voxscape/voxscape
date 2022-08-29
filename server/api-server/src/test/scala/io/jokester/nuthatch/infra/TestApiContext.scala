package io.jokester.nuthatch.infra

import com.typesafe.config.{Config, ConfigFactory}
import io.jokester.nuthatch.quill.generated.{public => T}

object TestApiContext {
  def build(): ApiContext with TestHelper = {
    new ApiContext with TestHelper {
      override def rootConfig: Config = ConfigFactory.load()
      logger.debug("got rootConfig: {}", rootConfig)

      override def redisConfig: Config = rootConfig.getConfig("test.redis")

      override def postgresConfig: Config = rootConfig.getConfig("test.postgres")
    }

  }

  trait TestHelper { self: ApiContext =>

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
