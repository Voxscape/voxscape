package io.jokester.voxscape

import io.circe.Json
import io.circe.generic.auto._
import io.jokester.api.OpenAPIConvention
import sttp.tapir._
import sttp.tapir.generic.auto._
import sttp.tapir.json.circe.jsonBody

object ModelManagerApi {

  case class CreateUploadUrlRequest(
      filename: String,
      contentType: String,
  )

  case class AuthorizedUploadUrl(
      url: String,
  )

  def apiRoot = endpoint

  def createUploadUrl: Endpoint[Unit, CreateUploadUrlRequest, Unit, AuthorizedUploadUrl, Any] =
    endpoint.post
      .in("createUpdateUrl")
      .in(jsonBody[CreateUploadUrlRequest])
      .out(jsonBody[AuthorizedUploadUrl])

}
