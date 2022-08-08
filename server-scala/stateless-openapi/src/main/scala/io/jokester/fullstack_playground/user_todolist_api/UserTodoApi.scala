package io.jokester.fullstack_playground.user_todolist_api

import io.circe.generic.auto._
import io.jokester.http_api.JwtAuthConvention._
import io.jokester.http_api.OpenAPIBuilder
import io.jokester.http_api.OpenAPIConvention._
import sttp.tapir.generic.auto._
import sttp.tapir.json.circe.jsonBody
import sttp.tapir._

import java.time.OffsetDateTime

/**
  * TODO: validation
  */
object UserTodoApi extends UserApi with TodoApi {

  case class AuthSuccess(
      userId: Int,
      profile: UserProfile,
      accessToken: String,
      refreshToken: String,
  )

  object endpoints {

    private val basePath: Endpoint[Unit, Unit, ApiError, Unit, Any] =
      endpoint
        .in("user_todo_api")
        .errorOut(defaultErrorOutputMapping)

    /**
      *
      */
    private val authedBasePath: Endpoint[TaintedToken, Unit, ApiError, Unit, Any] = {
      implicit val x = Codec.string

      basePath
        .securityIn(auth.bearer[String]().mapTo[TaintedToken])
    }

    val createUser
        : Endpoint[Unit, UserTodoApi.CreateUserRequest, ApiError, UserTodoApi.UserAccount, Any] =
      basePath.post
        .in("users")
        .in(jsonBody[CreateUserRequest])
        .out(jsonBody[UserAccount])

    val login: Endpoint[Unit, UserTodoApi.LoginRequest, ApiError, AuthSuccess, Any] =
      basePath.post
        .in("auth" / "login")
        .in(jsonBody[LoginRequest])
        .out(jsonBody[AuthSuccess])

    val refreshToken: Endpoint[TaintedToken, Unit, ApiError, AuthSuccess, Any] = basePath.post
      .in("auth" / "refresh_token")
      .securityIn(auth.bearer[String]().mapTo[TaintedToken])
      .out(jsonBody[AuthSuccess])

    val updateUserProfile: Endpoint[
      TaintedToken,
      (Int, UserTodoApi.UserProfile),
      ApiError,
      UserTodoApi.UserAccount,
      Any,
    ] =
      authedBasePath.put
        .in("users" / path[Int]("userId") / "profile")
        .in(jsonBody[UserProfile])
        .out(jsonBody[UserAccount])

    val createTodo: Endpoint[
      TaintedToken,
      (Int, UserTodoApi.CreateTodoRequest),
      ApiError,
      UserTodoApi.CreateTodoResponse,
      Any,
    ] =
      authedBasePath.post
        .in("users" / path[Int]("userId") / "todos")
        .in(jsonBody[CreateTodoRequest])
        .out(jsonBody[CreateTodoResponse])

    val updateTodo: Endpoint[
      TaintedToken,
      (Int, Int, UserTodoApi.CreateTodoResponse),
      ApiError,
      UserTodoApi.CreateTodoResponse,
      Any,
    ] = authedBasePath.patch
      .in("users" / path[Int]("userId") / "todos" / path[Int]("todoId"))
      .in(jsonBody[CreateTodoResponse])
      .out(jsonBody[CreateTodoResponse])

    val deleteTodo: Endpoint[TaintedToken, (Int, Int), ApiError, Unit, Any] =
      authedBasePath.delete.in("users" / path[Int]("userId") / "todos" / path[Int]("todoId"))

    val listTodo: Endpoint[TaintedToken, (Int), ApiError, UserTodoApi.TodoList, Any] =
      authedBasePath.get
        .in("users" / path[Int]("userId") / "todos")
        .out(jsonBody[TodoList])
  }

  val endpointList: Seq[Endpoint[_, _, _, _, _]] = Seq(
    endpoints.createUser,
    endpoints.login,
    endpoints.refreshToken,
    endpoints.updateUserProfile,
    endpoints.createTodo,
    endpoints.deleteTodo,
    endpoints.updateTodo,
    endpoints.listTodo,
  )

  def asOpenAPIYaml: String = OpenAPIBuilder.buildOpenApiYaml(endpointList, "user-todo", "0.1")
}

trait UserApi {

  // entities
  case class UserAccount(userId: Int, profile: UserProfile)
  case class UserProfile(nickname: Option[String], avatarUrl: Option[String])

  case class CreateUserRequest(email: String, initialPass: String, profile: UserProfile)
  case class LoginRequest(email: String, password: String)
}

trait TodoApi { self: UserApi =>

  case class TodoItem(
      todoId: Int,
      userId: Int,
      title: String,
      description: String,
      finishedAt: Option[OffsetDateTime],
  )
  case class TodoList(items: Seq[TodoItem])

  case class CreateTodoRequest(title: String, description: String)
  type CreateTodoResponse = TodoItem
  type UpdateTodoRequest  = TodoItem
  type UpdateTodoResponse = TodoItem
}
