package io.jokester.nuthatch.scopes.authn
import io.jokester.nuthatch.infra.Const.TempEmail
import io.jokester.nuthatch.quill.generated.{public => T}

/** @internal
  */
private[authn] case class UserWithAuth(
    user: T.User,
    userOAuth1: Seq[T.UserOauth1],
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
