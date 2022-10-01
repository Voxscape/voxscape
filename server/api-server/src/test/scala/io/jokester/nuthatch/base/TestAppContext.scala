package io.jokester.nuthatch.base

import cats.effect.IO
import cats.effect.kernel.Resource
import com.typesafe.config.{Config, ConfigFactory}
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.generated.quill.{public => T}
import redis.clients.jedis.Jedis

object TestAppContext {
  def build(): AppContextBase with TestHelper = {
    new AppContextBase with TestHelper with LazyLogging { self =>
      def rootConfig: Config = ConfigFactory.load()

      logger.debug("got rootConfig: {}", rootConfig)

      override def redisConfig: Config = rootConfig.getConfig("test.redis")

      override val quill: QuillFactory.RdbContext =
        QuillFactory.unsafeCreateNonPolledCtx(rootConfig.getConfig("test.postgres"))._2

      override def redis: Resource[IO, Jedis] = RedisFactory.resourceFromConfig(redisConfig)

      override object web extends WebConfig {
        protected override val siteConfig: Config = rootConfig.getConfig("site")
      }

      override object providers extends Providers {
        protected override val rootConfig: Config = self.rootConfig
      }
    }
  }

  trait TestHelper {
    self: AppContextBase =>

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
