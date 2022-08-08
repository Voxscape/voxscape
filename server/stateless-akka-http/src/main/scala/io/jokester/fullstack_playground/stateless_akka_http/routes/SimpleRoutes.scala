package io.jokester.fullstack_playground.stateless_akka_http.routes

import akka.http.scaladsl.model.{HttpHeader, HttpRequest}
import akka.http.scaladsl.server.Directives.{
  complete,
  concat,
  extractRequest,
  extractRequestEntity,
  extractStrictEntity,
  get,
  path,
  pathPrefix,
}
import akka.http.scaladsl.server.Route

import java.lang.management.ManagementFactory
import java.time.Clock
import io.circe.generic.auto._
import de.heikoseeberger.akkahttpcirce.FailFastCirceSupport._

import java.util.concurrent.TimeUnit
import scala.concurrent.duration.FiniteDuration

object SimpleRoutes {

  private case class IncomingHttpHeader(name: String, value: String)
  private case class IncomingRequestDump(
      method: String,
      incomingHeaders: Seq[IncomingHttpHeader],
      body: Option[String] = None,
  )

  private val clock = Clock.systemUTC()

  def route: Route =
    pathPrefix("simple") {
      concat(
        pingRoute,
        echoHeadersRoute,
        echoRequestRoute,
      )
    }

  private def pingRoute: Route = {
    (get & path("ping")) {
      complete(
        s"Server running at ${clock.instant()}. JVM Uptime= ${ManagementFactory.getRuntimeMXBean.getUptime}ms",
      )
    }
  }

  private def echoHeadersRoute: Route = {
    (get & path("echo-headers")) {
      extractRequest(req => {
        val dump =
          IncomingRequestDump(method = req.method.value, incomingHeaders = dumpRequestHeaders(req))
        complete(dump)
      })
    }
  }

  private def echoRequestRoute: Route = {
    path("echo-request") {
      extractRequest(req => {
        extractStrictEntity(FiniteDuration(15, TimeUnit.SECONDS)) { strictEntity =>
          {
            complete(
              IncomingRequestDump(
                method = req.method.value,
                incomingHeaders = dumpRequestHeaders(req),
                body = Some(strictEntity.data.encodeBase64.utf8String),
              ),
            )
          }
        }
      })
    }
  }

  private def dumpRequestHeaders(req: HttpRequest): Seq[IncomingHttpHeader] = {
    req.headers.map((a: HttpHeader) => IncomingHttpHeader(a.lowercaseName(), a.value()))
  }
}
