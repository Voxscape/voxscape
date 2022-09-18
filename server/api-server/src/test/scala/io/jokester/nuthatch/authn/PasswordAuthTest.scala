package io.jokester.nuthatch.authn

import io.jokester.nuthatch.base.{AppContextBase, TestContext}
import org.scalatest.BeforeAndAfterAll
import org.scalatest.flatspec.AnyFlatSpec

class PasswordAuthTest extends AnyFlatSpec with BeforeAndAfterAll with TestContext {

  lazy val testee = new EmailSignup with EmailLogin with BaseAuth {
    override protected def appCtx: AppContextBase = testAppContext
  }

  "new user" can "create user" in {
    // TODO: learn how to test with cats.effect
  }

}
