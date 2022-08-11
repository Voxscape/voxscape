package io.jokester.nuthatch.infra

object RedisKeys {
  object auth {
    // value: oauth
    def twitterOAuth1Token(oauthToken: String) = s"auth:twitterOAuth1:oauthToken:$oauthToken"
  }

}
