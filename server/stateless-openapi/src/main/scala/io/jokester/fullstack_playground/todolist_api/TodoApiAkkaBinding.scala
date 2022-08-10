package io.jokester.fullstack_playground.todolist_api

import akka.http.scaladsl.server.Route
import cats.syntax.either._
import akka.http.scaladsl.server.Directives.{concat, pathPrefix}
import io.jokester.fullstack_playground.todolist_api.TodoApi.TodoList
import io.jokester.api.OpenAPIConvention
import sttp.capabilities.WebSockets
import sttp.capabilities.akka.AkkaStreams
import sttp.tapir._
import sttp.tapir.server.ServerEndpoint
import sttp.tapir.server.akkahttp.AkkaHttpServerInterpreter

import scala.language.implicitConversions
import scala.concurrent.{ExecutionContext, Future}

/**
  *
  */
object TodoApiAkkaBinding {

  def buildTodoApiRoute(impl: TodoApiService)(implicit ec: ExecutionContext): Route = {
    import sttp.tapir.server.akkahttp.AkkaHttpServerInterpreter
    val endpoints   = TodoApi.endpoints
    val interpreter = AkkaHttpServerInterpreter()

    val serverImplRoute =
      interpreter.toRoute(
        List(
          endpoints.listTodo.serverLogic(req => Future(impl.list())),
          endpoints.showTodo.serverLogic(req => Future(impl.show(req))),
          endpoints.createTodo.serverLogic(req => Future(impl.create(req))),
          endpoints.updateTodo.serverLogic(req => Future(impl.update(req._1, req._2))),
          endpoints.deleteTodo.serverLogic(req => Future(impl.remove(req))),
        ),
      )
    serverImplRoute

  }

  def exmaple(): Unit = {

    // the endpoint: single fixed path input ("hello"), single query parameter
    // corresponds to: GET /hello?name=...
    val helloWorld: PublicEndpoint[String, Unit, String, Any] =
      endpoint.get.in("hello").in(query[String]("name")).out(stringBody)

    // converting an endpoint to a route (providing server-side logic); extension method comes from imported packages
    val helloWorldRoute: Route =
      AkkaHttpServerInterpreter().toRoute(
        helloWorld.serverLogicSuccess(name => Future.successful(s"Hello, $name!")),
      )

  }
}
