package io.jokester.fullstack_playground.quill

import io.getquill.util.LoadConfig
import io.getquill.{PostgresDialect, PostgresJdbcContext, SnakeCase}
import io.jokester.fullstack_playground.quill.generated.public.PublicExtensions
import io.jokester.fullstack_playground.quill.generated.userTodo.UserTodoExtensions
import io.jokester.scala_commons.quill.QuillDataSource

object QuillContextFactory extends QuillDataSource {

  type PublicCtx = PostgresJdbcContext[FixedPostgresNaming.type]
    with PublicExtensions[PostgresDialect, FixedPostgresNaming.type]

  def createPublicContext(
      configPrefix: String,
  ): PublicCtx = {
    val dbConf = LoadConfig(configPrefix)
    val hikariSource = poolePgDataSource(
      dbConf.getString("url"),
      dbConf.getString("user"),
      dbConf.getString("password"),
    )

    new PostgresJdbcContext[FixedPostgresNaming.type](FixedPostgresNaming, hikariSource)
      with PublicExtensions[PostgresDialect, FixedPostgresNaming.type]
  }

  type UserTodoCtx = PostgresJdbcContext[FixedPostgresNaming.type]
    with UserTodoExtensions[PostgresDialect, FixedPostgresNaming.type]

  def createUserTodoContext(configPrefix: String): UserTodoCtx = {

    val dbConf = LoadConfig(configPrefix)
    val hikariSource = poolePgDataSource(
      dbConf.getString("url"),
      dbConf.getString("user"),
      dbConf.getString("password"),
    )

    new PostgresJdbcContext[FixedPostgresNaming.type](FixedPostgresNaming, hikariSource)
      with UserTodoExtensions[PostgresDialect, FixedPostgresNaming.type]
  }

}
