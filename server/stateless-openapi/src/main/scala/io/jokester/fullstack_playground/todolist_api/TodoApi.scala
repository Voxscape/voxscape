package io.jokester.fullstack_playground.todolist_api

import io.circe.generic.auto._
import io.jokester.api.OpenAPIBuilder
import io.jokester.api.OpenAPIConvention._
import sttp.apispec.openapi.OpenAPI
import sttp.model.StatusCode
import sttp.tapir._
import sttp.tapir.generic.auto._
import sttp.tapir.json.circe.jsonBody

import java.time.Instant

object TodoApi {

  def endpointList =
    Seq(
      endpoints.listTodo,
      endpoints.showTodo,
      endpoints.createTodo,
      endpoints.updateTodo,
      endpoints.deleteTodo,
    )

  def asOpenAPIYaml: String =
    OpenAPIBuilder.buildOpenApiYaml(
      endpointList,
      "TodoAPI",
      "1.0",
    )

  def asOpenAPI: OpenAPI = OpenAPIBuilder.buildOpenApi(endpointList, "TodoAPI", "1.0")

  case class Todo(
      id: Int,
      title: String,
      desc: String,
      finished: Boolean,
      updatedAt: Instant,
  )

  case class CreateTodoIntent(title: String, desc: String)

  /** @note
    *   must not "extends AnyVal" or there will be mismatch between OpenAPI / Scala
    * @fixme
    *   this does not make "todos" required in OpenAPI
    */
  case class TodoList(todos: Seq[Todo])

  object endpoints {
    val listTodo: PublicEndpoint[Unit, ApiError, TodoList, Any] = basePath.get
      .out(statusCode(StatusCode.Ok))
      .out(jsonBody[TodoList])
      .name("list TODO")
      .description("get list of TODOs")

    val showTodo: Endpoint[Unit, Int, ApiError, Todo, Any] =
      basePath.get
        .in(path[Int]("todoId"))
        .out(statusCode(StatusCode.Ok))
        .out(jsonBody[Todo])
        .name("show TODO")
        .description("get TODO by id")

    val createTodo: Endpoint[Unit, CreateTodoIntent, ApiError, Todo, Any] = basePath.post
      .in(jsonBody[CreateTodoIntent])
      .out(statusCode(StatusCode.Created))
      .out(jsonBody[Todo])
      .name("create TODO")
      .description("create TODO item")

    val updateTodo: Endpoint[Unit, (Int, Todo), ApiError, Todo, Any] =
      basePath.patch
        .in(path[Int]("todoId"))
        .in(jsonBody[Todo])
        .out(statusCode(StatusCode.Ok))
        .out(jsonBody[Todo])
        .name("update TODO")
        .description("update todoItem")

    val deleteTodo: Endpoint[Unit, Int, ApiError, Unit, Any] =
      basePath.delete
        .in(path[Int]("todoId"))
        .out(statusCode(StatusCode.Ok))
        .name("delete TODO")
        .description("delete todoItem")

    private def basePath =
      endpoint
        .in("todos")
        .errorOut(defaultErrorOutputMapping)
  }

}
