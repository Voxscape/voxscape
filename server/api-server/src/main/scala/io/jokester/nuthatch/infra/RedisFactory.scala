package io.jokester.nuthatch.infra
import cats.effect.kernel.Resource.ExitCase
import cats.effect.{IO, Resource}
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import redis.clients.jedis.{Jedis, JedisPool}

import scala.util.{Success, Using, Try}

object RedisFactory extends LazyLogging {
  def poolFromConfig(c: Config): JedisPool = {
    if (c.isResolved) {
      // e.g. redis://:password@host:port/0
      val url  = c.getString("url")
      val pool = new JedisPool(url)

      val conn = pool.getResource
      val info = Try { conn.info() }
      conn.close()
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
      logger.debug("borrowed jedis: {} / {}", System.identityHashCode(jedis))

      /** FIXME: every instance returned twice?
        */
      def onFinish(exitCase: ExitCase): IO[Unit] = {
        logger.debug("jedisPool onFinish: {} / {}", System.identityHashCode(jedis), exitCase)
        exitCase match {
          case ExitCase.Errored(_) =>
            IO {
              logger.debug("returning jedis: {} / {}", System.identityHashCode(jedis), exitCase)
              jedisPool.returnBrokenResource(jedis)
            }
          /** Including ExitCase.Cancelled , */

          case _ =>
            IO {
              logger.debug("returning jedis: {} / {}", System.identityHashCode(jedis), exitCase)
              jedisPool.returnResource(jedis)
            }
        }

      }

      (jedis, exitCase => onFinish(exitCase))
    })
  }
}
