package io.jokester.nuthatch

import cats.effect.{ExitCode, IO}
import com.typesafe.scalalogging.LazyLogging

object Scripts extends LazyLogging {
  def runScript(command: String, rest: List[String]): IO[ExitCode] = {
    command match {
      case "fetchTwitterFollower" => fetchTwitterFollower(rest)
      case _ => logger.error("unknown command: {}", command)
    }
    IO.pure(ExitCode.Success)
  }
  
  private def fetchTwitterFollower(rest: List[String]): IO[ExitCode] = {
    rest match {
      case List(screenName) =>
        TwitterClient.fetchFollower(screenName).flatMap { followers =>
          IO {
            println(followers)
          }
        }
      case _ =>
        IO {
          println("Usage: fetchTwitterFollower <screenName>")
        }
    }
  }

}
