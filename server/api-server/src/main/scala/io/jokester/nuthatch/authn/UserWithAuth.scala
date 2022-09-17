package io.jokester.nuthatch.authn

import io.jokester.nuthatch.generated.quill.{public => T}
import io.jokester.nuthatch.consts._

/** @internal
  */
private[authn] case class UserWithAuth(
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
      isActivated = email.isDefined,
    )
  }
}
