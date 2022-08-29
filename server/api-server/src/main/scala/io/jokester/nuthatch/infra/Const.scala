package io.jokester.nuthatch.infra

import cats.effect.IO
import java.util.Random

import java.util.UUID
import scala.util.matching.Regex

object Const {
  object OAuth1Provider {
    val twitter = "twitter_oauth1"
  }

  object TempEmail {
    val placeholderSuffix = "@@@placeholder"
  }
}
