package io.jokester.nuthatch.scopes.user

import com.github.scribejava.apis.TwitterApi
import com.github.scribejava.core.builder.ServiceBuilder
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import io.jokester.web.URIEncoding


object OAuth extends LazyLogging {
  def issueTwitterOAuthUrl(c: Config, redirectPath: Option[String]): String = {
    val redirectQuery = redirectPath.map(URIEncoding.encodeURIComponent).map(encoded => s"?redirect=$encoded")
    val callbackUrl= c.getString("callback_url") + redirectQuery.getOrElse("")
    val client = new ServiceBuilder(
      c.getString("consumer_key"),
    ).apiSecret(
      c.getString("consumer_secret"),
    ).callback(callbackUrl)
      .build(TwitterApi.instance())

    val reqToken = client.getRequestToken

    val authUrl = client.getAuthorizationUrl(reqToken)

    authUrl
  }

}
