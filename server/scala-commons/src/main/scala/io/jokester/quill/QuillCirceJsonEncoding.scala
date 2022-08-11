package io.jokester.quill

import com.typesafe.scalalogging.LazyLogging
import io.circe.parser.{parse => parseJson}
import io.circe.{Json, JsonObject}
import io.getquill.PostgresJdbcContext
import org.postgresql.util.PGobject

import java.sql.Types

trait QuillCirceJsonEncoding[T <: PostgresJdbcContext[_]] {
  self: LazyLogging =>

  protected val ctx: T
  protected lazy implicit val jsonDecoder: ctx.type#Decoder[Json] =
    ctx.decoder((index, row, session) => {
      val f = row.getString(index)
      logger.debug("got value: {}", f)
      parseJson(f).getOrElse(Json.Null)
    })

  protected lazy implicit val jsonEncoder: ctx.type#Encoder[Json] = ctx.encoder(
    Types.JAVA_OBJECT,
    (index, value, row) => {
      val jsonObject = new PGobject()
      jsonObject.setType("json")
      jsonObject.setValue(value.noSpaces)
      row.setObject(index, jsonObject)
    },
  )

}

/** @deprecated
  */
trait QuillCirceJsonObjEncoding[T <: PostgresJdbcContext[_]] { self: LazyLogging =>
  val DO_NOT_USE: Nothing = ???

  protected val ctx: T

  protected lazy implicit val jsonDecoder: ctx.type#Decoder[JsonObject] =
    ctx.decoder((index, row, session) =>
      parseJson(row.getString(index)).fold(
        fail => JsonObject.empty,
        success => success.asObject.getOrElse(JsonObject.empty),
      ),
    )

  protected lazy implicit val jsonEncoder: ctx.type#Encoder[JsonObject] = ctx.encoder(
    Types.JAVA_OBJECT,
    (index, value, row) => {
      val jsonObject = new PGobject()
      jsonObject.setType("json")
      jsonObject.setValue(Json.fromJsonObject(value).noSpaces)
      row.setObject(index, jsonObject)
    },
  )

}
