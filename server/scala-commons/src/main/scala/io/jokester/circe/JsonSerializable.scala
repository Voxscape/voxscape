package io.jokester.circe

import io.circe.generic.semiauto._
import io.circe.{Encoder, Json, parser}

import scala.util.Try

trait JsonSerializable[T <: AnyRef] {
  self: T =>
  private lazy val encoder: Encoder[T] = ??? // deriveEncoder[T]

  def asJson_NotWorking: Json = {
    encoder(self)
  }
}

/*
object JsonSerializable {

  def encode[T <: AnyRef](value: T): Json = {
    val encoder = deriveEncoder[T]
    encoder(value)
  }

  def tryDecode[T <: AnyRef](json: String): Try[T] = {
    ???
    val decoder = deriveDecoder[T]
    parser.parse(json).flatMap(decoder.decodeJson).toTry
  }

  def decode[T <: AnyRef](json: String): T = tryDecode[T](json).get

}

 */
