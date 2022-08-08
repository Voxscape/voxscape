package io.jokester.fullstack_playground.quill

object TestQuillCtxFactory {
  def createTestPublicContext: QuillContextFactory.PublicCtx =
    QuillContextFactory.createPublicContext("database.test")

  def createTestUserTodoContext: QuillContextFactory.UserTodoCtx =
    QuillContextFactory.createUserTodoContext("database.test")
}
