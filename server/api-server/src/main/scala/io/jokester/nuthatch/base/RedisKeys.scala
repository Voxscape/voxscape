package io.jokester.nuthatch.base

trait RedisKeys { self: AppContext =>
  private lazy val keyPrefix = redisConfig.getString("key_prefix")
  object redisKeys {
    object authn {
      // value: oauth_token_secret
      def twitterOAuth1Token(oauthToken: String) =
        s"${keyPrefix}:auth:twitterOAuth1:oauthToken:$oauthToken"

    }
  }

}
