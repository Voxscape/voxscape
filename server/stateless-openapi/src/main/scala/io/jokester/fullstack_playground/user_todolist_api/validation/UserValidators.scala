package io.jokester.fullstack_playground.user_todolist_api.validation
import cats.data.Validated
import io.jokester.fullstack_playground.user_todolist_api.UserTodoApi._
import io.jokester.http_api.OpenAPIConvention.{BadRequest, Failable}

import scala.language.implicitConversions

object UserValidators extends UserValidators

trait UserValidators {

  private implicit def transformValidated[T](from: Validated[String, T]): Failable[T] =
    from.fold(
      l => Left(BadRequest(l)),
      r => Right(r),
    )

  def validateCreateUserRequest(intent: CreateUserRequest): Failable[CreateUserRequest] = {
    Validated.Valid(intent.copy(email = intent.email.trim.toLowerCase))
  }
}
