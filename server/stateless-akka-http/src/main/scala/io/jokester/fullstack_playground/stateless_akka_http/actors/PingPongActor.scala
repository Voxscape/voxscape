package io.jokester.fullstack_playground.stateless_akka_http.actors

import akka.actor.typed.scaladsl.Behaviors
import akka.actor.typed.{ActorRef, Behavior}
import akka.util.Timeout
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.duration.DurationInt
import scala.util.Success

object PingActor extends LazyLogging {
  trait Command

  case class StartPing()                                    extends Command
  case class QueryPing()                                    extends Command
  private case class WrappedPongRes(res: PongActor.PongRes) extends Command

  def apply(): Behavior[Command] = {
    Behaviors.setup[Command] { ctx =>
      val pongActor = ctx.spawn(PongActor(), "pong")
      // adapter: convert other actor's response to own known format
      val pongResponseMapper: ActorRef[PongActor.PongRes] =
        ctx.messageAdapter(res => WrappedPongRes(res))

      def active(): Behavior[Command] = {
        import akka.actor.typed.scaladsl.AskPattern._

        Behaviors.receiveMessage({
          case StartPing() =>
            logger.debug(s"received StartPing")
            pongActor ! PongActor.Pong(pongResponseMapper)
            Behaviors.same

          case QueryPing() =>
            logger.debug(s"received QueryPing")

            implicit val timeout: Timeout = 3.seconds
            ctx.ask[ /* Req */ PongActor.GetPong, /* Res */ PongActor.PongRes](
              pongActor,
              (ref: ActorRef[PongActor.PongRes]) => PongActor.GetPong(ref),
            ) { case Success(r @ PongActor.PongRes(_)) =>
              WrappedPongRes(r)
            }

            Behaviors.same

          case WrappedPongRes(pong @ PongActor.PongRes(_)) =>
            logger.debug(s"received pong: ${pong}")
            ctx.scheduleOnce(
              1.seconds,
              pongActor,
              PongActor.Pong(pongResponseMapper),
            )
            Behaviors.same
        })
      }

      active()
    }
  }

}

object PongActor {
  sealed trait Command
  case class Pong(replyTo: ActorRef[PongRes])    extends Command
  case class GetPong(replyTo: ActorRef[PongRes]) extends Command
  case class PongRes(count: Int)                 extends Command

  def apply(): Behavior[Command] =
    Behaviors.setup[Command] { ctx =>
      var count = 0

      Behaviors.receiveMessage[Command]({ case Pong(replyTo) =>
        count += 1
        replyTo ! PongRes(count)
        Behaviors.same
      })
    }

}
