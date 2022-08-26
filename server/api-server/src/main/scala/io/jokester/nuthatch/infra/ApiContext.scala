package io.jokester.nuthatch.infra

import cats.effect.IO
import cats.effect.kernel.Resource
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import com.zaxxer.hikari.HikariDataSource
import redis.clients.jedis.Jedis

import scala.util.{Failure, Try}

object ApiContext {
  def buildDefault($rootConfig: Config): ApiContext = new ApiContext {
    override def rootConfig: Config     = $rootConfig
    override def redisConfig: Config    = rootConfig.getConfig("redis")
    override def postgresConfig: Config = rootConfig.getConfig("postgres")
  }
}

trait ApiContext extends LazyLogging with RedisKeys {
  def rootConfig: Config
  protected def redisConfig: Config
  protected def postgresConfig: Config

  private lazy val jedisPool          = RedisFactory.poolFromConfig(redisConfig)
  lazy val redis: Resource[IO, Jedis] = RedisFactory.wrapJedisPool(jedisPool)

  protected lazy val quillResources: (HikariDataSource, QuillFactory.PublicCtx) =
    QuillFactory.unsafeCreatePooledQuill(postgresConfig)

  lazy val quill: QuillFactory.PublicCtx = quillResources._2

  def unsafeClose(): Unit = {
    Try {
      logger.debug("closing Jedis pool")

      /** FIXME: this causes a strange "Invalidated object not currently part of this pool" error
        */
      quillResources._1.close()
    } match {
      case Failure(exception) => logger.warn("error closing Jedis pool", exception)
      case _                  =>
    }

  }

  def close(): IO[Unit] = IO { unsafeClose() }
}
