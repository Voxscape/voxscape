package io.jokester.fullstack_playground

import akka.actor.typed.ActorSystem
import akka.http.scaladsl.server.Directives.concat
import akka.http.scaladsl.server.Directives._
import com.typesafe.scalalogging.LazyLogging
import io.jokester.akka.AkkaHttpServer
import io.jokester.fullstack_playground.stateless_akka_http.actors.SinkManagerActor
import io.jokester.fullstack_playground.stateless_akka_http.routes.SimpleRoutes
import io.jokester.fullstack_playground.stateless_akka_http.routes.MessageSinkHandler

object StatelessAkkaHttpMain extends App with LazyLogging {

  private val actorSystem: ActorSystem[SinkManagerActor.Command] =
    ActorSystem(SinkManagerActor(), "sink-system")
  private val sinkRoute = new MessageSinkHandler(actorSystem)(actorSystem)

  AkkaHttpServer.listenWithSystem(
    (AkkaHttpServer.withCors & AkkaHttpServer.withRequestLogging) {
      pathPrefix("stateless-akka-http") {
        concat(
          /**
            * GET /stateless-akka-http/simple/ping
            * GET /stateless-akka-http/simple/echo-headers
            * (any method) /stateless-akka-http/simple/echo-request
            */
          SimpleRoutes.route,
          /**
            * @see `ActorBasedRoutes`
            */
          sinkRoute.route,
        )
      }
    },
    port = Option(8080),
  )(actorSystem.classicSystem)
}
