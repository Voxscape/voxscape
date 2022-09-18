package io.jokester.nuthatch.authn

import io.jokester.nuthatch.authn.AuthenticationService
import io.jokester.nuthatch.base.{AppContext, TestAppContext}
import org.scalatest.BeforeAndAfterAll
import org.scalatest.flatspec.AnyFlatSpec

class TwitterOAuthTest extends AnyFlatSpec with BeforeAndAfterAll { self =>

  private lazy val apiContext = TestAppContext.build()
  private val testee = new AuthenticationService {
    override protected val appCtx: AppContext = self.apiContext
  }

  "AuthenticationService" should "run" in {}

  "AuthenticationService" should "create user from authed twitter user" in {}

  override def beforeAll(): Unit = {
    apiContext.cleanDb()
  }

  override def afterAll(): Unit = {
    apiContext.unsafeClose()
  }

}
