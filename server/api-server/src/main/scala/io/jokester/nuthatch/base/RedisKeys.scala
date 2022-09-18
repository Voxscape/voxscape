package io.jokester.nuthatch.base

trait RedisKeys {
  self: AppContext =>
  private lazy val keyPrefix = redisConfig.getString("key_prefix")

  object redisKeys {
    case class RedisKVPair(key: String, value: String)

    object authn {
      // value: oauth_token_secret
      def twitterOAuth1Token(oauthToken: String): String =
        s"$keyPrefix:auth:twitterOAuth1:oauthToken=$oauthToken"

      def userActivationLink(nonce: String): String = {
        s"$keyPrefix:auth:userActivationLink:nonce=$nonce"
      }

      def userActivationLinkIssued(userId: Int): String = {
        s"$keyPrefix:auth:userActivationLinkIssued:nonce=$userId"

      }
    }
  }

}
