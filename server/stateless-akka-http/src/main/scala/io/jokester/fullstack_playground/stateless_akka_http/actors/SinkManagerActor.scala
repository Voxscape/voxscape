package io.jokester.fullstack_playground.stateless_akka_http.actors

import akka.actor.typed.{ActorRef, Behavior}
import akka.actor.typed.scaladsl.{AbstractBehavior, ActorContext, Behaviors}
import com.typesafe.scalalogging.LazyLogging

import java.util.UUID

object SinkManagerActor extends LazyLogging {
  sealed trait Command
  case class GetSink(sinkName: String, replyTo: ActorRef[GotSink]) extends Command
  case class GotSink(sinkActor: ActorRef[SinkActor.Command])       extends Command

  def apply(): Behaviors.Receive[Command] = {
    var map: Map[String, ActorRef[SinkActor.Command]] = Map.empty

    Behaviors.receive({
      case (ctx, GetSink(sinkName, replyTo)) =>
        val existed = map.get(sinkName)
        val c = {
          val sinkId = UUID.randomUUID()
          existed.getOrElse(ctx.spawn(SinkActor(sinkName, sinkId), s"sink-${sinkId}"))
        }
        map += sinkName -> c
        replyTo ! SinkManagerActor.GotSink(c)

        Behaviors.same

    })
  }
}
