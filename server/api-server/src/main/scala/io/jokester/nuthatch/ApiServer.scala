package io.jokester.nuthatch

import io.jokester.akka.AkkaHttpServer

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext}

object ApiServer extends App {
  println("hello")

  val finish = AkkaHttpServer.waitKeyboardInterrupt()(ExecutionContext.global)
  Await.result(finish, Duration.Inf)

}
