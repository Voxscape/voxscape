package io.jokester.nuthatch

import com.typesafe.config.{Config, ConfigFactory}
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.infra.{ApiBinder, ApiContext, QuillFactory, RedisFactory}
import cats.effect.{ExitCode, IO, IOApp, Resource}
import com.comcast.ip4s.IpLiteralSyntax
import io.jokester.api.OpenAPIBuilder
import io.jokester.cats_effect.TerminateCondition
import io.jokester.http4s.VerboseLogger
import io.jokester.nuthatch.scopes.authn.AuthenticationService
import org.http4s.{HttpApp, HttpRoutes, Request}
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.server.{Router, Server}

import java.nio.file.{Files, Path}
import scala.concurrent.duration._

object ApiServer extends IOApp with LazyLogging {
  val config: Config = ConfigFactory.load()

  def runServer: IO[ExitCode] = {
    val rootConfig = ConfigFactory.load()
    val apiContext = new ApiContext(rootConfig)
    val authn      = new AuthenticationService(apiContext);

    val apiRoutes: HttpRoutes[IO] =
      ApiBinder.buildRoutes(authn).tapWith(VerboseLogger.logReqRes[IO])

    val httpApp: HttpApp[IO] =
      Router[IO]("/api/nuthatch_v1" -> apiRoutes, "/" -> VerboseLogger.notFound).orNotFound

    val apiServer: Resource[IO, Server] = EmberServerBuilder
      .default[IO]
      .withHost(ipv4"0.0.0.0")
      .withPort(port"8080")
      .withHttpApp(httpApp)
      .build

    for (
      redisInfo  <- apiContext.redis.use(jedis => IO { jedis.info() });
      serverPair <- apiServer.allocated;
      _          <- IO.race(TerminateCondition.enterPressed, IO.sleep(600.second));
      _          <- serverPair._2;
      _          <- IO { logger.info("{} stopped", serverPair._1) };
      _          <- apiContext.close();
      _          <- IO { logger.info("shutting down") }
    ) yield ExitCode.Success
  }

  def exportApiSpec(destFilename: String): IO[ExitCode] = IO {
    logger.info("Exporting OpenAPI spec to {}", destFilename)
    Files.writeString(
      Path.of(destFilename),
      OpenAPIBuilder.buildOpenApiYaml(ApiBinder.apiList, "nuthatch", "0.1"),
    )
    ExitCode.Success
  }

  def run(args: List[String]): IO[ExitCode] = {
    args match {
      case List("writeOpenApiSpec", dest) => exportApiSpec(dest)
      case List()                         => runServer
      case List("runServer")              => runServer
      case _ => IO.println(s"command not recognized: $args").map(_ => ExitCode.Error)
    }
  }
}
