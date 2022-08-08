package io.jokester.fullstack_playground.utils.akka_http

import akka.actor.typed.ActorSystem
import akka.actor.{ActorSystem => UntypedActorSystem}
import akka.actor.typed.scaladsl.Behaviors
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.{HttpEntity, HttpMethods, HttpResponse, StatusCodes}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.directives.LoggingMagnet
import akka.http.scaladsl.server.{Directive0, Route, RouteResult}
import ch.megard.akka.http.cors.scaladsl.CorsDirectives.cors
import ch.megard.akka.http.cors.scaladsl.settings.CorsSettings
import com.typesafe.scalalogging.LazyLogging

import java.time.Clock
import java.util.UUID
import scala.concurrent.{ExecutionContext, ExecutionContextExecutor, Future}

object AkkaHttpServer extends LazyLogging {

  /**
    * Listen with an ad-hoc `ActorSystem`
    * and block until keypress
    */
  def listen(
      rootRoute: Route,
      interface: Option[String] = None,
      port: Option[Int] = None,
  ): Future[Unit] = {
    val typedSystem: ActorSystem[Nothing] = ActorSystem(Behaviors.empty, "adhoc-system")
    listenWithSystem(rootRoute, interface, port)(untypedSystem = typedSystem.classicSystem)
  }

  def listenWithNewSystem(
      routeBuilder: ActorSystem[Nothing] => Route,
      interface: Option[String] = None,
      port: Option[Int] = None,
  ): Future[Unit] = {

    val typedSystem: ActorSystem[Nothing] = ActorSystem(Behaviors.empty, "adhoc-system")
    val rootRoute                         = routeBuilder(typedSystem)
    listenWithSystem(rootRoute, interface, port)(untypedSystem = typedSystem.classicSystem)
  }

  /**
    * Listen with provided `ActorSystem`
    * and block until keypress
    */
  def listenWithSystem(
      rootRoute: Route,
      interface: Option[String] = None,
      port: Option[Int] = None,
  )(implicit untypedSystem: UntypedActorSystem): Future[Unit] = {
    import scala.concurrent.duration._

    implicit val executionContext: ExecutionContextExecutor = untypedSystem.getDispatcher

    val bindInterface = interface.getOrElse("0.0.0.0")
    val bindPort      = port.getOrElse(8080)

    val bindingFuture = Http()
      .newServerAt(interface = bindInterface, port = bindPort)
      .bind(rootRoute)
      .map(_.addToCoordinatedShutdown(10.seconds))
      .map(server => {
        logger.info(s"Server online at http://$bindInterface:$bindPort/")
        server
      })

    for (
      bound      <- bindingFuture;
      stop       <- waitKeyboardInterrupt();
      unbound    <- bound.unbind();
      terminated <- untypedSystem.terminate()
    ) yield {
      logger.info("ActorSystem terminated: {}", terminated)
      ()
    }
  }

  def withRequestLogging: Directive0 = {
    extractRequest.flatMap(req => {
      extractLog.flatMap(logger => {
        val reqId      = UUID.randomUUID()
        val reqStartAt = System.currentTimeMillis()
        logger.debug(s"req[${reqId}]: ${req.method.value} ${req.uri}")
        logResult(
          LoggingMagnet(_logger =>
            _res => {
              logger.debug(
                s"req[${reqId}]: got ${_res} in ${System.currentTimeMillis() - reqStartAt}ms",
              )
            },
          ),
        )
      })
    })
  }

  def withCors: Directive0 = {
    extractActorSystem.flatMap(actorSystem =>
      cors(
        CorsSettings
          .default(actorSystem.classicSystem)
          .withAllowedMethods(
            Seq(
              HttpMethods.GET,
              HttpMethods.OPTIONS,
              HttpMethods.POST,
              HttpMethods.DELETE,
              HttpMethods.PUT,
              HttpMethods.PATCH,
            ),
          ).withMaxAge(Some(600L)),
      ),
    )
  }

  def fallback404Route: Route = {
    (get | options | post | delete | put | patch) {
      (extractRequest & extractLog)((req, logger) => {
        logger.info("unhandled 404 route {} {}", req.method.value, req.uri.path)
        complete(HttpResponse(status = StatusCodes.NotFound, entity = HttpEntity("not found")))
      })
    }
  }

  def waitKeyboardInterrupt()(implicit executionContext: ExecutionContext): Future[Unit] =
    Option(System.console())
      .map(console =>
        Future[Unit] {
          logger.info(s"Press ENTER to stop")
          // let it run until user presses return
          console.readLine()
        },
      )
      .getOrElse({
        logger.info(s"No TTY found. Ignoring console.")
        Future.never
      })
}
