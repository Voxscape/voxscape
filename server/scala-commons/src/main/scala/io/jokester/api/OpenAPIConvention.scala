package io.jokester.api

import io.circe.generic.auto._
import sttp.tapir.Schema
import sttp.tapir.generic.auto._
import sttp.model.StatusCode
import sttp.tapir.json.circe.jsonBody
import sttp.tapir.{EndpointOutput, oneOf, oneOfVariant}

import scala.concurrent.Future

object OpenAPIConvention {
  sealed trait ApiError extends Throwable {
    def message: String
    override def getMessage: String = message
  }

  // http 400
  case class BadRequest(message: String) extends ApiError

  // http 401
  case class Unauthorized(message: String) extends ApiError

  // http 403
  case class Forbidden(message: String) extends ApiError

  // http 404
  case class NotFound(message: String) extends ApiError

  // http 500
  case class ServerError(message: String) extends ApiError

  // http 501
  case class NotImplemented(message: String) extends ApiError

  val defaultErrorOutputMapping: EndpointOutput[ApiError] =
    oneOf[ApiError](
      oneOfVariant(
        StatusCode.Unauthorized,
        jsonBody[Unauthorized].description("login required"),
      ),
      oneOfVariant(StatusCode.NotFound, jsonBody[NotFound].description("resource not found")),
      oneOfVariant(
        StatusCode.Forbidden,
        jsonBody[Forbidden].description("user identity known but action not permitted"),
      ),
      oneOfVariant(
        StatusCode.BadRequest,
        jsonBody[BadRequest].description("client's bad in general"),
      ),
      oneOfVariant(
        StatusCode.NotImplemented,
        jsonBody[NotImplemented].description("not implemented"),
      ),
      oneOfVariant(
        StatusCode.InternalServerError,
        jsonBody[ServerError].description("server's bad in general"),
      ),
    )

  type ApiResultSync[T] = Either[ApiError, T]
  type ApiResult[T]     = Future[ApiResultSync[T]]

  type Failable[A]  = Either[ApiError, A]
  type FailableP[A] = Future[Either[ApiError, A]]
}
