package io.jokester.http_api

import org.scalatest.concurrent.ScalaFutures

import scala.concurrent.Future
import scala.language.implicitConversions

trait FailableValues extends ScalaFutures {

  implicit def summon[T](v: Failable[T]): ApiResultSync[T] = {
    Future.successful(v).futureValue
  }

}
