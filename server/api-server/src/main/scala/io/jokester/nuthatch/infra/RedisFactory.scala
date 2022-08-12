package io.jokester.nuthatch.infra
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import redis.clients.jedis.{Jedis, JedisPool}

import scala.util.{Success, Using}

object RedisFactory extends LazyLogging {

  def fromConfig(c: Config): JedisPool = {
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
}
