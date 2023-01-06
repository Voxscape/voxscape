package io.jokester.nuthatch.authn

import cats.effect.IO
import com.github.scribejava.core.model.OAuth1AccessToken

trait OAuthCredProvider {
  self: BaseAuth =>
  def loadOAuth1Cred(userId: Int, provider: String): IO[Option[OAuth1Cred]] = {
    findUserById(userId)
      .map { maybeUser =>
        for (
          u     <- maybeUser;
          found <- u.findByProvider(provider)
        )
          yield OAuth1Cred(
            found.provider,
            found.providerId,
            new OAuth1AccessToken(found.accessToken, found.accessTokenSecret),
          )
      }
  }
}

case class OAuth1Cred(provider: String, providerUserId: String, accessToken: OAuth1AccessToken)
