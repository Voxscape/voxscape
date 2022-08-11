package io.jokester.fullstack_playground

import akka.http.scaladsl.server.Directives.pathPrefix
import com.typesafe.scalalogging.LazyLogging
import io.jokester.akka.AkkaHttpServer
import io.jokester.fullstack_playground.todolist_api.{
  TodoApi,
  TodoApiAkkaBinding,
  TodoApiService,
  TodoApiMemoryImpl,
}

import java.nio.file.{Files, Path}

object StatelessOpenAPIMain extends App with LazyLogging {

  args match {
    case Array("writeOpenApiSpec", outputFilename: String) =>
      logger.info(s"Writing ApiSpec to ${outputFilename}")
      Files.writeString(Path.of(outputFilename), TodoApi.asOpenAPIYaml)

    case Array("server") =>
      AkkaHttpServer.listenWithNewSystem(routeBuilder = { actorSystem =>
        implicit val ec = actorSystem.executionContext

        /** CRUD
          */
        val todoRoute = TodoApiAkkaBinding.buildTodoApiRoute(new TodoApiMemoryImpl())

        val rootRoute = pathPrefix("stateless-openapi") {
          todoRoute
        }

        (AkkaHttpServer.withCors & AkkaHttpServer.withRequestLogging) {
          rootRoute
        }
      })

    case _ =>
      logger.error(s"Command Not Recognized: ${args}")
      System.exit(1)

  }
}
