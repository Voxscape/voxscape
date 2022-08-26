package io.jokester.nuthatch.scopes

import io.jokester.nuthatch.infra.{ApiContext, TestApiContext}
import io.jokester.nuthatch.scopes.authn.AuthenticationService
import org.scalatest.BeforeAndAfterAll
import org.scalatest.flatspec.AnyFlatSpec
import twitter4j.User

class TwitterOAuthTest extends AnyFlatSpec with BeforeAndAfterAll { self =>

  private lazy val apiContext = TestApiContext.build()
  private val testee = new AuthenticationService {
    override protected val apiCtx: ApiContext = self.apiContext
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
