package io.jokester.nuthatch.infra

import cats.effect.IO
import cats.effect.kernel.Resource
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import redis.clients.jedis.Jedis

import scala.util.{Failure, Try}

class ApiContext(val rootConfig: Config) extends LazyLogging {
  private val jedisPool = RedisFactory.poolFromConfig(rootConfig.getConfig("redis.default"))
  def redis: Resource[IO, Jedis] = RedisFactory.wrapJedisPool(jedisPool)

  private val quillResources = QuillFactory.unsafeCreatePooledQuill(rootConfig.getConfig("database.default"))

  val quill: QuillFactory.PublicCtx = quillResources._2

  def close(): IO[Unit] = IO.blocking {
    Try {
      logger.debug("closing Jedis pool")
      quillResources._1.close()
      jedisPool.close()
    } match {
      case Failure(exception) => logger.warn("error closing Jedis pool", exception)
      case _                  =>
    }
  }
}
