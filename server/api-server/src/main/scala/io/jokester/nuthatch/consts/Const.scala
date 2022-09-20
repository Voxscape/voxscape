package io.jokester.nuthatch.consts

private object Const { /* to make ide happy */ }

object OAuth1Provider {
  val twitter = "twitter_oauth1"
}

object TempEmail {
  val placeholderSuffix = "@@@placeholder"
  def oauth1DummyEmail(provider: String, externalId: String): String = {
    s"oauth1:provider=${provider}:external_id=${externalId}:${TempEmail.placeholderSuffix}"
  }
}
