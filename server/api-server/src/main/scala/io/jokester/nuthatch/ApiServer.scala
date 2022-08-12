package io.jokester.nuthatch

import com.typesafe.config.ConfigFactory
import com.typesafe.scalalogging.LazyLogging
import io.jokester.akka.AkkaHttpServer
import io.jokester.nuthatch.infra.RedisFactory

import scala.concurrent.duration.Duration
import scala.concurrent.Await

object ApiServer extends App with LazyLogging {
  val config       = ConfigFactory.load()
  val redisPool = RedisFactory.fromConfig(config.getConfig("redis.default"))

  def startServerAndWait(): Unit = {

    val serverDown = AkkaHttpServer.listenWithNewSystem(system => {
      AkkaHttpServer.fallback404Route
    })
    Await.result(serverDown, Duration.Inf)
  }
}
