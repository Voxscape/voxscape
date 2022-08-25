package io.jokester.nuthatch.scopes.authn
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
}
