package io.jokester.nuthatch.scopes.authn

import cats.effect.IO
import com.github.scribejava.apis.TwitterApi
import com.github.scribejava.core.builder.ServiceBuilder
import com.github.scribejava.core.model.{OAuth1AccessToken, OAuth1RequestToken}
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.infra.{ApiContext, RedisKeys}
import org.http4s.Query
import redis.clients.jedis.Jedis

class TwitterOAuth1Flow(c: Config, apiContext: ApiContext) extends LazyLogging {

  def issueTwitterOAuthUrl(
      query: Query = Query.empty,
  ): IO[String] = {

    val redirectQuery = if (query.isEmpty) "" else s"?${query.renderString}"
    val callbackUrl   = c.getString("callback_url") + redirectQuery

    val client = new ServiceBuilder(c.getString("consumer_key"))
      .apiSecret(c.getString("consumer_secret"))
      .callback(callbackUrl)
      .build(TwitterApi.instance())

    for (
      /** "temporary credentials"
        */
      reqToken <- IO.blocking(client.getRequestToken);
      _        <- saveToken(reqToken);
      authUrl  <- IO.blocking(client.getAuthorizationUrl(reqToken))
    ) yield authUrl
  }

  private def saveToken(reqToken: OAuth1RequestToken): IO[Unit] = apiContext.redis.use(jedis =>
    IO.blocking {
      jedis.setex(
        RedisKeys.auth.twitterOAuth1Token(reqToken.getToken),
        7200,
        reqToken.getTokenSecret,
      )
    },
  )

  private def loadToken(oauthToken: String): IO[OAuth1RequestToken] = {
    apiContext.redis.use(jedis =>
      IO.blocking {
        val oauthTokenSecret = Option(jedis.get(RedisKeys.auth.twitterOAuth1Token(oauthToken)))
        new OAuth1RequestToken(
          oauthToken,
          oauthTokenSecret.getOrElse(throw new RuntimeException("invalid OAuth1 token")),
        )
      },
    )
  }

  def exchangeToken(oauthToken: String, oauthVerifier: String)(implicit
      jedis: Jedis,
  ): IO[OAuth1AccessToken] = {
    for (
      reqToken <- loadToken(oauthToken);
      got <- IO.blocking(
        new ServiceBuilder(
          c.getString("consumer_key"),
        ).apiSecret(
          c.getString("consumer_secret"),
        ).build(TwitterApi.instance())
          .getAccessToken(reqToken, oauthVerifier),
      )
    ) yield got

  }
}
