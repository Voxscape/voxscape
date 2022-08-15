package io.jokester.nuthatch.infra

import cats.effect.IO
import com.typesafe.config.Config
import com.zaxxer.hikari.HikariDataSource
import io.getquill.{PostgresDialect, PostgresJdbcContext}
import io.jokester.nuthatch.quill.generated.public.PublicExtensions
import io.jokester.quill.QuillDataSource
import io.jokester.quill.QuillDataSource.FixedPostgresNaming

object QuillFactory {
  type PublicCtx = PostgresJdbcContext[FixedPostgresNaming.type]
    with PublicExtensions[PostgresDialect, FixedPostgresNaming.type]

  def createQuillContext(c: Config): IO[(HikariDataSource, PublicCtx)] = IO {
    val simpleDataSource = QuillDataSource.simplePgDataSource(c.getString("url"))
    val hikariDataSource = QuillDataSource.pooled(simpleDataSource)

    val ctx = new PostgresJdbcContext(FixedPostgresNaming, hikariDataSource)
      with PublicExtensions[PostgresDialect, FixedPostgresNaming.type]

    (hikariDataSource, ctx)
  }
}
