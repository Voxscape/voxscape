package io.jokester.nuthatch

import io.jokester.akka.AkkaHttpServer

import scala.concurrent.duration.Duration
import scala.concurrent.{Await}

object ApiServer extends App {
  val serverDown = AkkaHttpServer.listenWithNewSystem(system => {
    AkkaHttpServer.fallback404Route
  })
  Await.result(serverDown, Duration.Inf)
}
