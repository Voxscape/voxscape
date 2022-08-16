package io.jokester.nuthatch.infra
import cats.effect.kernel.Resource.ExitCase
import cats.effect.{IO, Resource}
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import redis.clients.jedis.{Jedis, JedisPool}

import scala.util.{Success, Using}

object RedisFactory extends LazyLogging {
  def poolFromConfig(c: Config): JedisPool = {
    if (c.isResolved) {
      val host = c.getString("host")
      val port = c.getInt("port")

      val pool = new JedisPool(host, port)

      val info = Using(pool.getResource)(_.info())
      info match {
        case Success(_) =>
          logger.info("Connected to Redis")
          return pool
        case _ =>
      }
    }
    throw new RuntimeException("Failed connecting to Redis")
  }

  def wrapJedisPool(jedisPool: JedisPool): Resource[IO, Jedis] = {
    Resource.applyCase(IO {
      val jedis = jedisPool.getResource
      logger.debug("borrowed jedis: {} / {}", jedis)

      (
        jedis,
        { (exitCode: ExitCase) =>
          logger.debug("returning jedis: {} / {}", jedis, exitCode)
          IO(exitCode match {
            case ExitCase.Succeeded => jedisPool.returnResource(jedis)
            case _                  => jedisPool.returnBrokenResource(jedis)
          })
        },
      )
    })
  }
}
