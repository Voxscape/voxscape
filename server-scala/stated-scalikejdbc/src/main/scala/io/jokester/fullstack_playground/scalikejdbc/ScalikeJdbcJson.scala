package io.jokester.fullstack_playground.scalikejdbc

import io.circe.{Decoder, Encoder, Json}
import org.postgresql.util.PGobject

trait ScalikeJdbcJson {

  protected def decodeJsonRaw(value: Any): Json = {
    value match {
      case pgObject: PGobject =>
        io.circe.parser
          .parse(pgObject.getValue)
          .getOrElse(
            throw new IllegalArgumentException(
              "ScalikeJdbcJson#decodeJsonRaw(): failed to decode PGobject as JSON",
            ),
          )
      case str: String =>
        io.circe.parser
          .parse(str)
          .getOrElse(
            throw new IllegalArgumentException(
              "ScalikeJdbcJson#decodeJsonRaw(): failed to decode String as JSON",
            ),
          )
      case _ =>
        throw new IllegalArgumentException(
          s"ScalikeJdbcJson#decodeJsonRaw(): expected PGobject or String, got ${value.getClass}",
        )
    }
  }

  protected def decodeJson[O: Decoder](value: Any): O = {
    val decoder = implicitly[Decoder[O]]
    val json    = decodeJsonRaw(value)
    decoder
      .decodeJson(json)
      .getOrElse(
        throw new IllegalArgumentException("ScalikeJdbcJson#decodePgObj(): failed to decode json"),
      )
  }

  protected def encodeJson[O: Encoder](value: O): PGobject = {
    val encoder    = implicitly[Encoder[O]]
    val jsonObject = new PGobject()
    jsonObject.setType("json")
    jsonObject.setValue(encoder(value).noSpaces)
    jsonObject
  }
}
