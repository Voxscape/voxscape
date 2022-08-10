package io.jokester.quill

import io.getquill.PostgresJdbcContext

import java.sql.Types
import java.time.OffsetDateTime

/**
  * low-level bindings
  */
trait QuillDatetimeEncoding[T <: PostgresJdbcContext[_]] {

  protected val ctx: T

  /**
    * implicit values must be of path-dependent type, not "OurCtx#decoder"
    */
  protected lazy implicit val offsetDateTimeDecoder: ctx.type#Decoder[OffsetDateTime] =
    ctx.decoder((index, row, session) => row.getObject(index, classOf[OffsetDateTime]))
  protected lazy implicit val offsetDateTimeEncoder: ctx.type#Encoder[OffsetDateTime] =
    ctx.encoder(
      Types.TIMESTAMP_WITH_TIMEZONE,
      (index, value, row) => {
        row.setObject(index, value)
      },
    )
}
