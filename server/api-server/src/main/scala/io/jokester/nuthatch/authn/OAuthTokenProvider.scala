package io.jokester.nuthatch.authn

import cats.effect.IO
import com.github.scribejava.core.model.OAuth1AccessToken

trait OAuthTokenProvider { self: BaseAuth =>
  def loadOAuth1Token(userId: Int, provider: String): IO[Option[OAuth1AccessToken]] = {
    findUserById(userId)
      .map { maybeUser =>
        for (
          u     <- maybeUser;
          found <- u.findByProvider(provider)
        )
          yield new OAuth1AccessToken(found.accessToken, found.accessTokenSecret)
      }
  }
}
