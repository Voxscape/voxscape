package io.jokester.nuthatch.authn

import cats.effect.IO
import io.jokester.api.OpenAPIConvention

private[authn] trait EmailLogin extends EmailSignup {
  self: BaseAuth =>

  def emailPasswordLogin(req: AuthenticationApi.Password.EmailLoginRequest): IO[UserAuthBundle] = {
    for (
      emailMatched <- findUserByEmail(req.email);
      matched <- emailMatched match {
        case Some(existed) if existed.passwordMatch(req.password) => IO.pure(existed)
        case _ => IO.raiseError(OpenAPIConvention.BadRequest("User not exist or password mismatch"))
      }
    ) yield matched
  }
}
