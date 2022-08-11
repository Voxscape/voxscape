package io.jokester.fullstack_playground.scalikejdbc

import io.circe
import io.circe.{Decoder, Encoder, Json, JsonObject}
import org.postgresql.util.PGobject
import scalikejdbc.Binders

/** FIXME: this does not work
  */
trait JsonEncodable[O] { self: O =>
  def toPgObj: PGobject = ???
}

@deprecated("no way to use with generated scalikejdbc tables")
trait ScalikeJdbcBinders {
  val jsonBinder: Binders[Json] = Binders.of[circe.Json] {
    // fromPg
    pgObj => decodePgObj(pgObj)
  } {
    // fromJvm
    fromJvm => (stmt, idx) =>
      stmt.setObject(idx, encodePgObj(fromJvm))
  }

  private def decodePgObj(pgValue: Any): Json =
    pgValue match {
      case pgObj: PGobject =>
        circe.parser
          .parse(pgObj.toString)
          .getOrElse(
            throw new IllegalArgumentException(s"expected pgObj with json value: ${pgObj}"),
          )
      case _ =>
        throw new IllegalArgumentException(s"expected pgObj with json value: ${pgValue}")
    }

  private def encodePgObj(json: Json): PGobject = {
    val jsonObject = new PGobject()
    jsonObject.setType("json")
    jsonObject.setValue(json.noSpaces)
    jsonObject
  }

  val jsonObjBinder: Binders[JsonObject] =
    jsonBinder.xmap(fromDB => fromDB.asObject.get, Json.fromJsonObject)

  protected def customObject[O: Encoder: Decoder]: Binders[O] = {
    val encoder = implicitly[Encoder[O]]
    val decoder = implicitly[Decoder[O]]
    jsonBinder
      .xmap[O](fromDB => decoder.decodeJson(fromDB).toOption.get, fromJvm => encoder(fromJvm))
  }
}
