package io.jokester.nuthatch.authn

import io.jokester.nuthatch.consts._
import io.jokester.nuthatch.generated.quill.{public => T}
import org.springframework.security.crypto.bcrypt.BCrypt

/** @internal
  */
private[authn] case class UserAuthBundle(
    user: T.User,
    userOAuth1: Seq[T.UserOauth1],
    userPassword: Option[T.UserPassword] = None,
) {
  def findByProvider(provider: String): Option[T.UserOauth1] = {
    userOAuth1.find(_.provider == provider)
  }

  def asCurrentUser(): AuthenticationApi.CurrentUser = {
    val email = Option(user.email).filter(!_.endsWith(TempEmail.placeholderSuffix))
    AuthenticationApi.CurrentUser(
      userId = user.id,
      email = email,
      isActivated = isEmailVerified,
    )
  }

  def hasPassword: Boolean = userPassword.isDefined

  def passwordMatch(plaintext: String): Boolean =
    userPassword.exists(u => BCrypt.checkpw(plaintext, u.passwordHash))

  def isEmailVerified: Boolean = hasEmail

  def hasEmail: Boolean = !user.email.endsWith(TempEmail.placeholderSuffix)
}
