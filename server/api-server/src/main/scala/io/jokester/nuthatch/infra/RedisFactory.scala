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
