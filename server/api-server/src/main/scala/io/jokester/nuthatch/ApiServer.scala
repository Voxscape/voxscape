package io.jokester.nuthatch

import com.typesafe.config.ConfigFactory
import io.jokester.akka.AkkaHttpServer
import io.jokester.nuthatch.infra.RedisContext

import scala.concurrent.duration.Duration
import scala.concurrent.Await

object ApiServer extends App {
  val config = ConfigFactory.load()
  val redisContext = RedisContext.fromConfig(config.getConfig("redis.default"))
  val serverDown = AkkaHttpServer.listenWithNewSystem(system => {
    AkkaHttpServer.fallback404Route
  })
  Await.result(serverDown, Duration.Inf)
}
