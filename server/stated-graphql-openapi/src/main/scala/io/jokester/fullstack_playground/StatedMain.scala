package io.jokester.fullstack_playground

import akka.http.scaladsl.server.Directives._
import com.typesafe.scalalogging.LazyLogging
import io.jokester.fullstack_playground.quill.QuillContextFactory
import io.jokester.fullstack_playground.todolist_api.{
  TodoApiAkkaBinding,
  TodoApiMemoryImpl,
  TodoApiQuillImpl,
}
import io.jokester.fullstack_playground.user_todolist_api.{
  UserTodoApi,
  UserTodoApiAkkaBinding,
  UserTodoServiceQuillImpl,
}
import io.jokester.scala_commons.akka.AkkaHttpServer

import java.nio.file.{Files, Path}
import scala.concurrent.ExecutionContext

object StatedMain extends App with LazyLogging {

  args match {
    case Array("writeOpenApiSpec", yamlPath) =>
      logger.info(s"writing OpenAPI spec to ${yamlPath}")
      Files.writeString(Path.of(yamlPath), UserTodoApi.asOpenAPIYaml)

    case Array("server") =>
      val publicCtx = QuillContextFactory.createPublicContext("database.default")

      val userTodoCtx = QuillContextFactory.createUserTodoContext("database.default")
      val userTodoSvc = new UserTodoServiceQuillImpl(userTodoCtx)

      val quillImpl  = new TodoApiQuillImpl(publicCtx)
      val memoryImpl = new TodoApiMemoryImpl()

      AkkaHttpServer
        .listenWithNewSystem(actorSystem => {
          implicit val ec: ExecutionContext = actorSystem.executionContext
          val todoApiRoute = concat(
            pathPrefix("stated-openapi") {
              // under "todos" prefix
              TodoApiAkkaBinding.buildTodoApiRoute(quillImpl)
            },
            pathPrefix("stateless-openapi") {
              // under "todos" prefix
              TodoApiAkkaBinding.buildTodoApiRoute(memoryImpl)
            },
          )

          val userTodoApiRoute = concat(
            pathPrefix("stated-openapi") {
              // under "user_todos" prefix
              UserTodoApiAkkaBinding.buildRoute(userTodoSvc)
            },
          )

          (AkkaHttpServer.withCors & AkkaHttpServer.withRequestLogging) {
            concat(todoApiRoute, userTodoApiRoute, AkkaHttpServer.fallback404Route)
          }
        })
        .andThen(_ => {
          logger.info("closing DB conn")
          publicCtx.close()
          userTodoCtx.close()
          logger.info("closed DB conn")
        })(scala.concurrent.ExecutionContext.global)

    case _ =>
      logger.debug("ARGV: {}", args.toList)
      throw new IllegalArgumentException(s"cannot recognize args: ${args.toList}")

  }

}
