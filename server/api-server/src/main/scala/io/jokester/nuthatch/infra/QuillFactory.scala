package io.jokester.nuthatch.infra

import cats.effect.IO
import cats.effect.kernel.Resource
import com.typesafe.config.Config
import com.zaxxer.hikari.HikariDataSource
import io.getquill.{PostgresDialect, PostgresJdbcContext}
import io.jokester.nuthatch.quill.generated.public.PublicExtensions
import io.jokester.quill.QuillDataSource
import io.jokester.quill.QuillDataSource.{FixedPostgresNaming, simplePgDataSource}

object QuillFactory {
  type PublicCtx = PostgresJdbcContext[FixedPostgresNaming.type]
    with PublicExtensions[PostgresDialect, FixedPostgresNaming.type]

  def createNonPooledCtx(c: Config): Resource[IO, PublicCtx] = {
    val simpleDataSource = QuillDataSource.simplePgDataSource(c.getString("url"))
    Resource.make(
      IO.blocking(
        new PostgresJdbcContext(FixedPostgresNaming, simpleDataSource)
          with PublicExtensions[PostgresDialect, FixedPostgresNaming.type],
      ),
    )(ctx => IO.blocking({ ctx.close() }))
  }

  def createQuillContext(c: Config): IO[(HikariDataSource, PublicCtx)] = IO {
    val simpleDataSource = QuillDataSource.simplePgDataSource(c.getString("url"))
    val hikariDataSource = QuillDataSource.pooled(simpleDataSource)

    val ctx = new PostgresJdbcContext(FixedPostgresNaming, hikariDataSource)
      with PublicExtensions[PostgresDialect, FixedPostgresNaming.type]

    (hikariDataSource, ctx)
  }
}
