package io.jokester.http_api

import sttp.tapir.Endpoint
import sttp.tapir.openapi.OpenAPI

object OpenAPIBuilder {
  def buildOpenApi(
      endpoints: Seq[Endpoint[_, _, _, _, _]],
      title: String,
      version: String,
  ): OpenAPI = {
    import sttp.tapir.docs.openapi.OpenAPIDocsInterpreter
    OpenAPIDocsInterpreter().toOpenAPI(endpoints, title, version)
  }

  def buildOpenApiYaml(
      endpoints: Seq[Endpoint[_, _, _, _, _]],
      title: String,
      version: String,
  ): String = {
    import sttp.tapir.openapi.circe.yaml._
    buildOpenApi(endpoints, title, version).toYaml
  }
}
