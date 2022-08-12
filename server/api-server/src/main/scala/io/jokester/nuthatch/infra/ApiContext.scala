package io.jokester.nuthatch.infra

import com.typesafe.config.Config
import redis.clients.jedis.{Jedis, JedisPool}

import scala.util.{Failure, Success, Try}

class ApiContext(private val jedisPool: JedisPool, private val rootConfig: Config) {

  def getConfig(path: String): Config = rootConfig.getConfig(path)

  def useRedis[T](io: Jedis => T): T = {
    val jedis = jedisPool.getResource

    Try(io(jedis)) match {
      case Success(value) =>
        jedisPool.returnResource(jedis)
        value
      case Failure(exception) =>
        jedisPool.returnBrokenResource(jedis)
        throw exception
    }
  }

}
