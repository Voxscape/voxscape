package io.jokester.nuthatch.infra

import java.io.Closeable
import cats.effect.IO
import cats.effect.kernel.Resource
import com.typesafe.config.Config
import com.zaxxer.hikari.HikariDataSource
import io.circe.{Json, JsonObject}
import io.getquill.{
  CompositeNamingStrategy2,
  PostgresDialect,
  PostgresEscape,
  PostgresJdbcContext,
  SnakeCase,
}
import io.jokester.nuthatch.quill.QuillJsonHelper
import io.jokester.nuthatch.quill.generated.public.PublicExtensions
import io.jokester.nuthatch.quill.generated.{public => T}
import io.jokester.quill.{QuillCirceJsonEncoding, QuillDataSource, QuillDatetimeEncoding}

import java.time.OffsetDateTime
//import io.jokester.quill.QuillDataSource.FixedPostgresNaming

import javax.sql.DataSource

object QuillFactory {
  val f = CompositeNamingStrategy2
  class PublicCtx(dataSource: DataSource with Closeable)
      extends PostgresJdbcContext(CompositeNamingStrategy2(SnakeCase, PostgresEscape), dataSource)
      with PublicExtensions[
        PostgresDialect,
        CompositeNamingStrategy2[SnakeCase.type, PostgresEscape.type],
      ]
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
