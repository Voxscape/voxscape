package io.jokester.nuthatch.authn

import io.jokester.nuthatch.base.{AppContextBase, TestContext}
import org.scalatest.BeforeAndAfterAll
import org.scalatest.flatspec.AnyFlatSpec

class TwitterOAuthTest extends AnyFlatSpec with BeforeAndAfterAll with TestContext {

  private val testee = new TwitterOAuth1 with BaseAuth {
    override protected def appCtx: AppContextBase = testAppContext
  }

  "AuthenticationService" should "run" in {}

  "AuthenticationService" should "create user from authed twitter user" in {}
}
