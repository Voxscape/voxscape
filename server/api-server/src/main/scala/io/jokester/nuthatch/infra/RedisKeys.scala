package io.jokester.nuthatch.infra

object RedisKeys {
  object auth {
    // value: oauth_token_secret
    def twitterOAuth1Token(oauthToken: String) = s"auth:twitterOAuth1:oauthToken:$oauthToken"
  }

}
