package io.jokester.quill

import io.getquill.context.jdbc.JdbcContextBase

import java.sql.Types
import java.time.OffsetDateTime

/** low-level bindings
  */
trait QuillDatetimeEncoding {

  self: JdbcContextBase[_, _] =>

  /** implicit values must be of path-dependent type, not "OurCtx#decoder"
    */
  implicit val offsetDateTimeDecoder: self.type#Decoder[OffsetDateTime] =
    self.decoder((index, row, session) => row.getObject(index, classOf[OffsetDateTime]))
  implicit val offsetDateTimeEncoder: self.type#Encoder[OffsetDateTime] =
    self.encoder(
      Types.TIMESTAMP_WITH_TIMEZONE,
      (index, value, row) => {
        row.setObject(index, value)
      },
    )
}
