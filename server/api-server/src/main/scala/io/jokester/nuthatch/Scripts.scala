package io.jokester.nuthatch

import cats.effect.{ExitCode, IO}
import com.typesafe.scalalogging.LazyLogging
import io.jokester.nuthatch.infra.ServiceBundle

class Scripts(serviceBundle: ServiceBundle) extends LazyLogging {
  def runScript(command: List[String]): IO[ExitCode] = {
    logger.debug("interpreting script command: {}", command)
    command match {
      case List("fetchTwitterFollower", uidString) =>
        fetchTwitterFollower(uidString.toInt)
      case _ =>
        logger.error("unknown command: {}", command)
        IO.pure(ExitCode.Error)
    }
  }

  private def fetchTwitterFollower(userId: Int): IO[ExitCode] = {
    IO {
      logger.debug("TODO: implement fetchTwitterFollower {}", userId)
      ExitCode.Error
    }
  }

}
