package io.jokester.nuthatch.authn

import cats.effect.IO
import io.jokester.api.OpenAPIConvention
import io.jokester.nuthatch.authn.AuthenticationApi.{Password, UserProfile}
import io.jokester.nuthatch.generated.quill.{public => T}
import org.springframework.security.crypto.bcrypt.BCrypt

private[authn] trait PasswordAuth { self: AuthenticationService =>

  private lazy val quill = appCtx.quill

  def attemptSignup(
      cred: AuthenticationApi.Password.EmailSignUpRequest,
  ): IO[AuthenticationApi.CurrentUser] = {
    for (
      emailMatched <- findUserByEmail(cred.email);
      created      <- createUser(cred, emailMatched)
    ) yield created
  }

  def attemptLogin(
      cred: AuthenticationApi.Password.EmailLoginCred,
  ): IO[AuthenticationApi.CurrentUser] = {
    for (
      emailMatched <- findUserByEmail(cred.email);
      matched <- emailMatched match {
        case Some(existed) if existed.passwordMatch(cred.password) => IO.pure(existed)
        case _ => IO.raiseError(OpenAPIConvention.BadRequest("User not exist or password mismatch"))
      }
    ) yield matched.asCurrentUser()
  }

  def completeEmailActivation(
      cred: AuthenticationApi.Password.EmailLoginCred,
      token: String,
  ): IO[AuthenticationApi.CurrentUser] = ???

  private def createUser(
      cred: Password.EmailSignUpRequest,
      emailMatched: Option[UserAuthBundle],
  ) = {
    emailMatched match {
      case Some(existed) if !existed.hasPassword =>
        IO.raiseError(
          OpenAPIConvention.BadRequest(
            "A user existed but password auth is not set up.\nTry resetting password if you are the owner.",
          ),
        )
      case Some(existed) if existed.passwordMatch(cred.initialPassword) =>
        IO.raiseError(OpenAPIConvention.BadRequest("A user already existed.\nTry login."))
      case Some(existed) =>
        IO.raiseError(
          OpenAPIConvention
            .BadRequest("A user already existed.\nTry login or resetting password."),
        )
      case _ =>
        insertEmailPasswordUser(cred)
          .flatMap(userId => findUserById(userId))
          .map(_.get.asCurrentUser())
    }
  }

  private def insertEmailPasswordUser(
      cred: AuthenticationApi.Password.EmailSignUpRequest,
  ): IO[Int] = IO {
    import quill._

    val passwordHash = BCrypt.hashpw(cred.initialPassword, "salute")

    val profileJson = cred.initialProfile.map(_.toJson)

    val insertUser = quote {
      query[T.User]
        .insert(_.email -> lift(cred.email), _.profile -> lift(profileJson))
        .returning(u => u.id)
    }

    val insertPasswordAuth = (userId: Int) =>
      quote {
        query[T.UserPassword].insert(_.userId -> lift(userId), _.passwordHash -> lift(passwordHash))
      }

    val newUserId = transaction {
      val userId = run(insertUser)
      run(insertPasswordAuth(userId))
      userId
    }

    newUserId
  }
}
