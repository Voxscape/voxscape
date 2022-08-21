package io.jokester.nuthatch.infra

import java.io.Closeable
import cats.effect.IO
import cats.effect.kernel.Resource
import com.typesafe.config.Config
import com.zaxxer.hikari.HikariDataSource
import io.getquill.{PostgresDialect, PostgresJdbcContext}
import io.jokester.nuthatch.quill.generated.public.PublicExtensions
import io.jokester.quill.{QuillCirceJsonEncoding, QuillDataSource, QuillDatetimeEncoding}
import io.jokester.quill.QuillDataSource.FixedPostgresNaming

import javax.sql.DataSource

object QuillFactory {
  class PublicCtx(dataSource: DataSource with Closeable) extends PostgresJdbcContext[FixedPostgresNaming.type](FixedPostgresNaming, dataSource)
    with PublicExtensions[PostgresDialect, FixedPostgresNaming.type]
    with QuillCirceJsonEncoding
    with QuillDatetimeEncoding

  def createNonPooledCtx(c: Config): Resource[IO, PublicCtx] = {
    val simpleDataSource = QuillDataSource.simplePgDataSource(c.getString("url"))
    Resource.make(
      IO.blocking(new PublicCtx(simpleDataSource))
    )(ctx => IO.blocking({ ctx.close() }))
  }

  def createPooledQuillContext(c: Config): IO[(HikariDataSource, PublicCtx)] = IO {
    val simpleDataSource = QuillDataSource.simplePgDataSource(c.getString("url"))
    val hikariDataSource = QuillDataSource.pooled(simpleDataSource)

    val ctx = new PublicCtx(hikariDataSource)

    (hikariDataSource, ctx)
  }
}
