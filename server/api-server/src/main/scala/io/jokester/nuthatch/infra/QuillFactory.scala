package io.jokester.nuthatch.infra

import cats.effect.IO
import cats.effect.kernel.Resource
import com.typesafe.config.Config
import com.zaxxer.hikari.HikariDataSource
import io.circe.{Json, JsonObject}
import io.getquill.{PostgresDialect, PostgresJdbcContext}
import io.jokester.nuthatch.quill.QuillJsonHelper
import io.jokester.nuthatch.quill.generated.public.PublicExtensions
import io.jokester.nuthatch.quill.generated.{public => T}
import io.jokester.quill.{
  FixedPostgresNaming,
  QuillCirceJsonEncoding,
  QuillDataSource,
  QuillDatetimeEncoding,
}

import java.io.Closeable
import java.time.OffsetDateTime
import javax.sql.DataSource

object QuillFactory {

  class PublicCtx(dataSource: DataSource with Closeable)
      extends PostgresJdbcContext(FixedPostgresNaming, dataSource)
      with PublicExtensions[PostgresDialect, FixedPostgresNaming.type]
      with QuillCirceJsonEncoding
      with QuillDatetimeEncoding
      with QuillJsonHelper
      with PublicCtxDummyFactory

  def createNonPooledCtx(c: Config): Resource[IO, PublicCtx] = {
    val simpleDataSource = QuillDataSource.simplePgDataSource(c.getString("url"))
    Resource.make(
      IO.blocking(new PublicCtx(simpleDataSource)),
    )(ctx => IO.blocking({ ctx.close() }))
  }

  def unsafeCreatePooledQuill(c: Config): (HikariDataSource, PublicCtx) = {
    val simpleDataSource = QuillDataSource.simplePgDataSource(c.getString("url"))
    val hikariDataSource = QuillDataSource.pooled(simpleDataSource)

    val ctx = new PublicCtx(hikariDataSource)
    (hikariDataSource, ctx)
  }

  trait PublicCtxDummyFactory {
    val dummyUser: T.User = T.User(
      id = -1,
      email = "CHANGE_ME",
      profile = None,
      createdAt = OffsetDateTime.MIN,
      updatedAt = OffsetDateTime.MIN,
    )
    val dummyOAuth1: T.UserOauth1 = T.UserOauth1(
      id = -2,
      userId = -1,
      provider = "DUMMY",
      accessToken = "DUMMY",
      accessTokenSecret = "DUMMY",
      providerId = "DUMMY",
      providerProfile = Json.fromJsonObject(JsonObject.empty),
      createdAt = OffsetDateTime.MIN,
      updatedAt = OffsetDateTime.MIN,
    )

  }
}
