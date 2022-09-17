package io.jokester.nuthatch.authn

import cats.effect.IO
import io.jokester.api.OpenAPIConvention
import io.jokester.nuthatch.generated.quill.{public => T}
import org.springframework.security.crypto.bcrypt.BCrypt

private[authn] trait PasswordAuth { self: AuthenticationService =>

  private lazy val quill = appCtx.quill

  def attemptSignup(
      cred: AuthenticationApi.Password.EmailSignUpRequest,
  ): IO[AuthenticationApi.CurrentUser] = IO {
    for (existed <- findUserByEmail(cred.email)) {}
    import quill._

    val created = transaction {
      ???
    }
    ???
  }

  def attemptLogin(
      cred: AuthenticationApi.Password.EmailLoginCred,
  ): IO[AuthenticationApi.CurrentUser] = {
    findUserByEmail(cred.email)
      .flatMap(existed => validatePassword(existed, cred.password))
      .map(_.asCurrentUser())
  }

  private def validatePassword(u: Option[UserWithAuth], password: String): IO[UserWithAuth] = {
    u match {
      case Some(value) =>
        val passwordMatch = value.userPassword.exists(userPassword =>
          BCrypt.checkpw(password, userPassword.passwordHash),
        )
        val havePassword = value.userPassword.isDefined

        if (passwordMatch) {
          IO.pure(value)
        } else if (havePassword) {
          IO.raiseError(OpenAPIConvention.BadRequest("password mismatch"))
        } else {
          // TODO: maybe prompt user the absence of password
          IO.raiseError(OpenAPIConvention.BadRequest("password mismatch"))
        }
      case _ => IO.raiseError(OpenAPIConvention.NotFound("user not found"))
    }
  }

  def completeEmailActivation(
      cred: AuthenticationApi.Password.EmailLoginCred,
      token: String,
  ): IO[AuthenticationApi.CurrentUser] = ???
}
