package io.jokester.fullstack_playground.user_todolist_api
import UserTodoApi._
import io.jokester.fullstack_playground.user_todolist_api.validation.UserValidators

import scala.concurrent.ExecutionContext

trait UserTodoServiceValidation extends UserValidators {
  self: UserTodoService =>

  implicit def ec: ExecutionContext

  override def createUser(req: CreateUserRequest): Failable[UserTodoApi.UserAccount] = {
    for (l <- validateCreateUserRequest(req); created <- self.createUser(l)) yield created
  }

}
