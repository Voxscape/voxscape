package io.jokester.nuthatch.scopes.authn

import com.github.scribejava.apis.TwitterApi
import com.github.scribejava.core.builder.ServiceBuilder
import com.github.scribejava.core.model.{OAuth1AccessToken, OAuth1RequestToken}
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.infra.RedisKeys
import io.jokester.web.URIEncoding
import redis.clients.jedis.Jedis

class TwitterOAuth1Flow(c: Config, jedis: Jedis) extends LazyLogging {
  def issueTwitterOAuthUrl(c: Config, redirectPath: Option[String]): String = {

    val redirectQuery =
      redirectPath.map(URIEncoding.encodeURIComponent).map(encoded => s"?redirect=$encoded")
    val callbackUrl = c.getString("callback_url") + redirectQuery.getOrElse("")

    val client = new ServiceBuilder(c.getString("consumer_key"))
      .apiSecret(c.getString("consumer_secret"))
      .callback(callbackUrl)
      .build(TwitterApi.instance())

    /**
     * "temporary credentials"
     */
    val reqToken = client.getRequestToken
    jedis.setex(RedisKeys.auth.twitterOAuth1Token(reqToken.getToken), 7200, reqToken.getTokenSecret)
    logger.debug("Twitter OAuth1 reqToken: {}", reqToken.getToken, reqToken.getTokenSecret)

    client.getAuthorizationUrl(reqToken)
  }

  def exchangeToken(oauthToken: String, oauthVerifier: String): OAuth1AccessToken = {
    val oauthTokenSecret = Option(jedis.get(RedisKeys.auth.twitterOAuth1Token(oauthToken)))
    val reqToken = new OAuth1RequestToken(
      oauthToken,
      oauthTokenSecret.getOrElse(new RuntimeException("invalid OAuth1 token")),
    )

    new ServiceBuilder(
      c.getString("consumer_key"),
    ).apiSecret(
      c.getString("consumer_secret"),
    ).build(TwitterApi.instance())
      .getAccessToken(reqToken, oauthVerifier)
  }

}
