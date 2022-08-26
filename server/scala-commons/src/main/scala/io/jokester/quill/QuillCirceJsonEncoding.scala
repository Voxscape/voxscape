package io.jokester.quill

import io.circe.parser.{parse => parseJson}
import io.circe.Json
import io.getquill.context.jdbc.JdbcContext
import org.postgresql.util.PGobject

import java.sql.Types

trait QuillCirceJsonEncoding {
  self: JdbcContext[_, _] =>

  implicit val jsonDecoder: self.type#Decoder[Json] =
    self.decoder((index, row, session) => {
      val f = row.getString(index)
//      logger.debug("got value: {}", f)
      parseJson(f).getOrElse(Json.Null)
    })

  implicit val jsonEncoder: self.type#Encoder[Json] = self.encoder(
    Types.OTHER,
    (index, value: Json, row) => {
      val jsonObject = new PGobject()
      jsonObject.setType("json")
      jsonObject.setValue(value.noSpaces)
      row.setObject(index, jsonObject)
    },
  )
}
