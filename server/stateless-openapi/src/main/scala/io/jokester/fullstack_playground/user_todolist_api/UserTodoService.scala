package io.jokester.fullstack_playground.user_todolist_api

import io.jokester.fullstack_playground.user_todolist_api.UserTodoApi.CreateTodoResponse
import io.jokester.api.JwtAuthConvention.UserId
import UserTodoApi._
import io.jokester.api.OpenAPIConvention

import scala.concurrent.Future

/** Auth-agnostic part
  */
trait UserTodoService {
  type Failable[A]  = Either[OpenAPIConvention.ApiError, A]
  type FailableP[A] = Future[Failable[A]]

  // user / auth
  def createUser(req: CreateUserRequest): Failable[UserAccount]
  def updateProfile(userId: UserId, newProfile: UserProfile): Failable[UserAccount]
  def showUser(userId: UserId): Failable[UserAccount]
  def loginUser(req: LoginRequest): Failable[UserAccount]

  // todos: CRUD
  def createTodo(userId: UserId, req: CreateTodoRequest): Failable[CreateTodoResponse]
  def listTodo(userId: UserId): Failable[TodoList]
  def updateTodo(userId: UserId, req: TodoItem): Failable[TodoItem]
  def deleteTodo(userId: UserId, todoId: Int): Failable[TodoItem]
}
