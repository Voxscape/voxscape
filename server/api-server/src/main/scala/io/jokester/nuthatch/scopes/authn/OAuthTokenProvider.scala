package io.jokester.nuthatch.scopes.authn
import cats.effect.IO
import com.github.scribejava.core.model.OAuth1AccessToken
import io.jokester.nuthatch.quill.generated.{public => T}

trait OAuthTokenProvider {
  def loadOAuth1Token(userId: Number, provider: String): IO[Option[OAuth1AccessToken]] =
    IO.blocking {
      ???
    }

}
