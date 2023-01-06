package io.jokester.cats_effect

import cats.effect.IO
import cats.syntax.either._
import com.typesafe.scalalogging.LazyLogging
import sun.misc.{Signal, SignalHandler}

object TerminateCondition extends LazyLogging {
  def enterPressed: IO[Unit] = {
    Option(System.console()) match {
      case None =>
        IO(logger.info("Console not found. Ignoring keyboard.")).flatMap(_ => IO.never)
      case Some(console) =>
        IO.async_(callback => {
          logger.info("Press ENTER to exit")
          console.readLine()
          logger.info("ENTER pressed")
          callback(().asRight)
        })
    }
  }
  def sigTerm: IO[Unit] = {
    IO.async_[Unit](callback => {
      val signalHandler = new SignalHandler {
        override def handle(signal: Signal): Unit = {
          logger.info("SIGTERM received")
          callback(().asRight)
        }
      }
      val term = new Signal("TERM")
      logger.debug("waiting for SIGTERM")
      Signal.handle(term, signalHandler) // and drop previous handler
    })
  }
}
