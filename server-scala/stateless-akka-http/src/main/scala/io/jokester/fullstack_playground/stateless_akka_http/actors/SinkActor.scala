package io.jokester.fullstack_playground.stateless_akka_http.actors

import akka.actor.typed.scaladsl.Behaviors
import akka.actor.typed.{ActorRef, Behavior}
import com.typesafe.scalalogging.LazyLogging

import java.time.Instant
import java.util.UUID

object SinkActor extends LazyLogging {
  trait Command

  final case class ReceivedMessage(msg: String, receivedAt: Instant)

  case class PostMessage(msg: ReceivedMessage, replyTo: ActorRef[MessageBatch]) extends Command
  case class GetMessage(replyTo: ActorRef[MessageBatch])                        extends Command
  case class WaitMessage(replyTo: ActorRef[MessageBatch])                       extends Command
  case class SubscribeMessage(outgoing: ActorRef[MessageBatch])                 extends Command
  case class UnsubscribeMessage(outgoing: ActorRef[Event])                      extends Command

  trait Event
  case class MessageBatch(sinkName: String, sinkId: UUID, messages: Seq[ReceivedMessage])
      extends Event
  case object Disconnect    extends Event
  case object DisconnectNow extends Event

  def apply(sinkName: String, sinkId: UUID): Behavior[SinkActor.Command] = {

    def buildBatch(messages: Seq[ReceivedMessage]) = MessageBatch(sinkName, sinkId, messages)

    Behaviors.setup { ctx =>
      val maxMsgCount                              = 10
      var recentMessages: Seq[ReceivedMessage]     = Seq.empty
      var subscribers: Set[ActorRef[MessageBatch]] = Set.empty
      var waiters: List[WaitMessage]               = List.empty

      Behaviors.receiveMessage({
        case GetMessage(replyTo) =>
          replyTo ! buildBatch(recentMessages)
          Behaviors.same

        case wm @ WaitMessage(_) =>
          waiters :+= wm
          Behaviors.same

        case SubscribeMessage(out) =>
          subscribers += out
          logger
            .debug("sink={} have a new subscriber. {} subscriber present", sinkId, subscribers.size)
          out ! buildBatch(recentMessages)
          Behaviors.same

        case UnsubscribeMessage(out) =>
          out ! Disconnect
          subscribers -= out
          logger
            .debug("sink={} lost a subscriber. {} subscriber present", sinkId, subscribers.size)
          Behaviors.same

        case PostMessage(msg, replyTo) =>
          recentMessages = (msg +: recentMessages).take(maxMsgCount)
          logger
            .debug("sink={} received new message. {} messages present", sinkId, recentMessages.size)

          val forSubscribers = buildBatch(Seq(msg))
          subscribers.foreach(s => s ! forSubscribers)

          waiters.foreach(s => s.replyTo ! forSubscribers)
          waiters = List.empty

          replyTo ! buildBatch(recentMessages)
          Behaviors.same
      })
    }
  }
}
