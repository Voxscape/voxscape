package io.jokester.nuthatch.infra

import cats.effect.IO
import cats.effect.kernel.Resource
import com.typesafe.config.Config
import redis.clients.jedis.Jedis

class ApiContext(private val rootConfig: Config) {

  def getConfig(path: String): Config = rootConfig.getConfig(path)

  def redis: Resource[IO, Jedis] = RedisFactory.createResFromConfig(getConfig("redis.default"))
}
