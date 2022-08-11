package io.jokester.api

import sttp.apispec.openapi.OpenAPI
import sttp.apispec.openapi.circe.yaml.RichOpenAPI
import sttp.tapir.Endpoint

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
    buildOpenApi(endpoints, title, version).toYaml
  }
}
