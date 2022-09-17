package io.jokester.nuthatch.scopes.twitter

import cats.effect.IO
import com.github.scribejava.core.model.OAuth1AccessToken

case class TwitterClientService(accessToken: OAuth1AccessToken) {

  def fetchFollowers(): IO[Nothing] = {
    IO.raiseError(new RuntimeException("not implemented"))
  }

}
