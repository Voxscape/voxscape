package io.jokester.nuthatch

import com.typesafe.config.{Config, ConfigFactory}
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.infra.{ApiBinder, QuillFactory, RedisFactory}
import cats.effect.{ExitCode, IO, IOApp, Resource}
import com.comcast.ip4s.IpLiteralSyntax
import io.jokester.api.OpenAPIBuilder
import org.http4s.HttpApp
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.server.{Router, Server}

import java.nio.file.{Files, Path}
import scala.concurrent.duration._

object ApiServer extends IOApp with LazyLogging {
  val config: Config = ConfigFactory.load()
  val redisPool      = RedisFactory.createResFromConfig(config.getConfig("redis.default"))

  val httpApp: HttpApp[IO] = Router[IO]().orNotFound

  val apiServer: Resource[IO, Server] = EmberServerBuilder
    .default[IO]
    .withHost(ipv4"0.0.0.0")
    .withPort(port"8080")
    .withHttpApp(httpApp)
    .build
  def runServer: IO[ExitCode] = {

    for (
      _quillCtx <- QuillFactory.createQuillContext(config.getConfig("database.default"));
      (pool, publicCtx) = _quillCtx;
      redisInfo  <- redisPool.use(jedis => IO { jedis.info() });
      serverPair <- apiServer.allocated;
      _          <- IO.sleep(3600.seconds);
      _          <- serverPair._2;
      _          <- IO { logger.info("{} stopped", serverPair._1) };
      _          <- IO { pool.close() }
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
