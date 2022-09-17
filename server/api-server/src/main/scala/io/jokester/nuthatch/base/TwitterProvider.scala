package io.jokester.nuthatch.base

import com.typesafe.config.Config
import twitter4j.TwitterFactory
import twitter4j.conf.ConfigurationBuilder

object TwitterProvider {
  def getTwitterFactory(conf: Config): TwitterFactory = {
    new TwitterFactory(
      new ConfigurationBuilder()
        .setOAuthConsumerKey(conf.getString("consumer_key"))
        .setOAuthConsumerSecret(conf.getString("consumer_secret"))
        .build(),
    )

  }

}
