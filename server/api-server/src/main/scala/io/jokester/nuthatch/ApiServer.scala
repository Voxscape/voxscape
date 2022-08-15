package io.jokester.nuthatch

import com.typesafe.config.{Config, ConfigFactory}
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.infra.{QuillFactory, RedisFactory}
import cats.effect.{ExitCode, IO, IOApp}

import java.nio.file.{Files, Path}
import scala.concurrent.duration._

object ApiServer extends IOApp with LazyLogging {
  val config: Config = ConfigFactory.load()
  val redisPool      = RedisFactory.createResFromConfig(config.getConfig("redis.default"))

  def runServer: IO[ExitCode] = {

    for (
      _quillCtx <- QuillFactory.createQuillContext(config.getConfig("database.default"));
      (pool, publicCtx) = _quillCtx;
      redisInfo <- redisPool.use(jedis => IO { jedis.info() });
      _         <- IO.println(redisInfo);
      _         <- IO.sleep(2.seconds);
      _         <- IO { pool.close() }
    ) yield ExitCode.Success
  }

  def exportApiSpec(destFilename: String): IO[ExitCode] = IO {
    Files.writeString(Path.of(destFilename), "TODO")
    ExitCode.Success
  }

  def run(args: List[String]): IO[ExitCode] = {
    args match {
      case List("writeApiSpec", dest) => exportApiSpec(dest)
      case List.empty                 => runServer
      case List("runServer")          => runServer
      case _ => IO.println(s"command not recognized: $args").map(_ => ExitCode.Error)
    }
  }
}
