package io.jokester.nuthatch

import com.typesafe.config.ConfigFactory
import com.typesafe.scalalogging.LazyLogging
import io.jokester.akka.AkkaHttpServer
import io.jokester.nuthatch.infra.RedisContext
import io.jokester.nuthatch.scopes.user.OAuth

import scala.concurrent.duration.Duration
import scala.concurrent.Await

object ApiServer extends App with LazyLogging {
  val config       = ConfigFactory.load()
  val redisContext = RedisContext.fromConfig(config.getConfig("redis.default"))

  tryTwitterCallback()
  def tryTwitterCallback(): Unit = {
    val url = OAuth.issueTwitterOAuthUrl(config.getConfig("twitter_oauth1"), Some("http://127.0.0.1:3000/before"))

    logger.info("got url: {}", url)
  }
  def startServerAndWait(): Unit = {

    val serverDown = AkkaHttpServer.listenWithNewSystem(system => {
      AkkaHttpServer.fallback404Route
    })
    Await.result(serverDown, Duration.Inf)
  }
}
