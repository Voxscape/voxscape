package io.jokester.cats_effect

import cats.effect.IO
import com.typesafe.scalalogging.LazyLogging
import sun.misc.{Signal, SignalHandler}

object TerminateCondition extends LazyLogging {
  lazy val enterPressed: IO[Unit] = {
    Option(System.console()) match {
      case None =>
        IO.blocking({ logger.info("Console not found. Ignoring keyboard.") }).flatMap(_ => IO.never)
      case Some(console) =>
        IO.blocking({
          logger.info("Press ENTER to exit")
          console.readLine()
        })
    }
  }
  lazy val sigTerm: IO[Unit] = {
    ???
  }

}
