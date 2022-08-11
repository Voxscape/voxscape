package io.jokester.nuthatch.infra
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import redis.clients.jedis.JedisPool

import scala.util.{Success, Using}

object RedisContext extends LazyLogging {

  def fromConfig(c: Config): RedisMethods = {
    if (c.isResolved) {
      val host = c.getString("host")
      val port = c.getInt("port")

      val pool = new JedisPool(host, port) with RedisMethods

      val info = Using(pool.getResource)(_.info())
      info match {
        case Success(_)=>
          logger.info("Connected to Redis")
          return pool
        case _ =>
      }
    }
    throw new RuntimeException("Failed connecting to Redis")
  }

  trait RedisMethods { self: JedisPool =>
  }
}

