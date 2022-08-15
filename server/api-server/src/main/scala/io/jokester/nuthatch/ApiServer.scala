package io.jokester.nuthatch

import com.typesafe.config.{Config, ConfigFactory}
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.infra.{QuillFactory, RedisFactory}
import cats.effect.{IO, IOApp, ExitCode}

import scala.concurrent.duration._

object ApiServer extends IOApp with LazyLogging {
  val config: Config = ConfigFactory.load()
  val redisPool      = RedisFactory.createResFromConfig(config.getConfig("redis.default"))

  def run(args: List[String]): IO[ExitCode] = {
    for (
      _quillCtx <- QuillFactory.createQuillContext(config.getConfig("database.default"));
      (pool, publicCtx) = _quillCtx;
      _ <- IO.sleep(2.seconds);
      _ <- IO { pool.close() }
    ) yield ExitCode.Success

  }
}
