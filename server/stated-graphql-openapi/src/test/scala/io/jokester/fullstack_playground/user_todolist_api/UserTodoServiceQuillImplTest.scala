package io.jokester.fullstack_playground.user_todolist_api

import io.jokester.fullstack_playground.quill.TestQuillCtxFactory
import org.scalatest.BeforeAndAfterAll
import org.scalatest.flatspec.AnyFlatSpec

class UserTodoServiceQuillImplTest
    extends AnyFlatSpec
    with UserTodoServiceTest
    with BeforeAndAfterAll {

  private val testCtx = TestQuillCtxFactory.createTestUserTodoContext

  override val testee = new UserTodoServiceQuillImpl(testCtx)

  override protected def afterAll(): Unit = {
    testCtx.close()
  }
}
