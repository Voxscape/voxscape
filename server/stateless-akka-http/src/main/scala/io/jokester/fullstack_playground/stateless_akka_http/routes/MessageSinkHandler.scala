package io.jokester.fullstack_playground.stateless_akka_http.routes

import akka.NotUsed
import akka.actor.typed.scaladsl.AskPattern._
import akka.actor.typed.{ActorRef, ActorSystem}
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.{Directive1, Route}
import akka.util.Timeout
import com.typesafe.scalalogging.LazyLogging
import akka.http.scaladsl.model.ws.{BinaryMessage, Message, TextMessage}
import akka.stream.{CompletionStrategy, Materializer, OverflowStrategy}
import akka.stream.scaladsl.{Flow, Sink, Source}
import akka.stream.typed.scaladsl.{ActorSink, ActorSource}

import scala.util.{Failure, Success}
import de.heikoseeberger.akkahttpcirce.FailFastCirceSupport._
import io.circe.generic.auto._
import io.circe.syntax._
import io.jokester.fullstack_playground.stateless_akka_http.actors.{SinkActor, SinkManagerActor}

import java.time.Clock
import java.util.concurrent.TimeoutException
import scala.concurrent.duration.DurationInt

class MessageSinkHandler(val sinkManagerActor: ActorRef[SinkManagerActor.Command])(implicit
    val actorSystem: ActorSystem[Nothing],
) extends LazyLogging {

  private val clock = Clock.systemUTC()

  def route: Route =
    pathPrefix("message-sink") {
      concat(getSinkRoute, postSinkRoute, waitSinkRoute, subscribeSinkRoute)
    }

  // GET /aaa
  private def getSinkRoute: Route = {
    (get & path(Segment)) { sinkName =>
      sinkByName(sinkName) { sinkActor =>
        askSink[SinkActor.MessageBatch](sinkActor, asker => SinkActor.GetMessage(asker)) {
          messages =>
            complete(messages)
        }
      }
    }
  }

  private def postSinkRoute: Route = {
    (post & path(Segment)) { sinkName =>
      sinkByName(sinkName) { sinkActor =>
        readBodyAsString { msgText =>
          askSink[SinkActor.MessageBatch](
            sinkActor,
            asker =>
              SinkActor.PostMessage(SinkActor.ReceivedMessage(msgText, clock.instant()), asker),
          ) { messages =>
            complete(messages)
          }
        }
      }
    }
  }

  private def waitSinkRoute: Route = {
    (get & path(Segment / "wait")) { sinkName =>
      sinkByName(sinkName) { sinkActor =>
        // NOTE akka has a 20s timeout
        implicit val askTimeout: Timeout = 10.seconds
        onComplete(
          sinkActor.ask[SinkActor.MessageBatch](asker => SinkActor.WaitMessage(asker)),
        ) {
          case Success(reply) => complete(reply)
          case Failure(e: TimeoutException) =>
            logger.debug("timeout waiting for reply", e)
            complete(StatusCodes.NotFound, "no new message in 10 seconds")
        }
      }
    }
  }

  private def subscribeSinkRoute: Route = {
    (get & path(Segment / "ws")) { sinkName =>
      sinkByName(sinkName) { sinkActor =>
        handleWebSocketMessages(createWsFlow(sinkActor))
      }
    }
  }

  private def createWsFlow(
      sinkActor: ActorRef[SinkActor.Command],
  ): Flow[Message, TextMessage, NotUsed] = {
    val (outgoingActor, outgoingSrcRaw) = ActorSource
      .actorRef[SinkActor.Event](
        completionMatcher = { case SinkActor.Disconnect =>
          logger.debug("completionMatcher")
        },
        failureMatcher = { case SinkActor.DisconnectNow =>
          logger.debug("failureMatcher")
          new RuntimeException("killed")
        },
        bufferSize = 16,
        overflowStrategy = OverflowStrategy.fail,
      )
      .preMaterialize()

    sinkActor ! SinkActor.SubscribeMessage(outgoingActor)

    val outgoingSrc: Source[TextMessage, NotUsed] = outgoingSrcRaw.map({
      case m: SinkActor.MessageBatch => TextMessage.Strict(m.asJson.spaces2)
    })

    val ignoreBinaryMessage: Flow[Message, TextMessage, NotUsed] =
      Flow[Message].mapConcat[TextMessage]({
        case m: TextMessage => Some(m)
        case b: BinaryMessage =>
          b.dataStream.runWith(Sink.ignore)
          Nil
        case _ => None
      })

    val readMsg: Flow[TextMessage, TextMessage.Strict, NotUsed] = Flow[TextMessage].mapAsync(1) {
      msg =>
        msg.toStrict(2.seconds)
    }

    val incomingSink = Flow[Message]
      .via(ignoreBinaryMessage)
      .via(readMsg)
      .map(msg =>
        SinkActor.PostMessage(
          SinkActor.ReceivedMessage(msg.text, clock.instant()),
          actorSystem.ignoreRef[Any],
        ),
      )
      .to(
        ActorSink.actorRef[SinkActor.Command](
          sinkActor,
          onCompleteMessage = {
            // when browser calls ws.close()
            SinkActor.UnsubscribeMessage(outgoingActor)
          },
          onFailureMessage = (throwable) => {
            // when browser calls ws.close(CODE, REASON)
            logger.debug("incomingSink: onFailure", throwable)
            SinkActor.UnsubscribeMessage(outgoingActor)
          },
        ),
      )

    Flow.fromSinkAndSource(incomingSink, outgoingSrc)
  }

  private def readBodyAsString: Directive1[String] = {
    extractStrictEntity(5.seconds, 16 * 1_024L).map(entity => entity.data.utf8String)
  }

  private def sinkByName(sinkName: String): Directive1[ActorRef[SinkActor.Command]] = {
    implicit val timeout: Timeout = 1.seconds
    onSuccess(
      sinkManagerActor.ask[SinkManagerActor.GotSink](asker =>
        SinkManagerActor.GetSink(sinkName, asker),
      ),
    ).map(gotSink => gotSink.sinkActor)
  }

  private def askSink[Res](
      sinkActor: ActorRef[SinkActor.Command],
      buildMsg: ActorRef[Res] => SinkActor.Command,
  ): Directive1[Res] = {
    implicit val timeout: Timeout = 2.seconds
    onSuccess(sinkActor.ask(buildMsg)).map(tuple => tuple)
  }
}
