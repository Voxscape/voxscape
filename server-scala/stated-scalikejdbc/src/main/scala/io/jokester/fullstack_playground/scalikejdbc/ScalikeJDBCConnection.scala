package io.jokester.fullstack_playground.scalikejdbc

import com.typesafe.scalalogging.LazyLogging
import scalikejdbc.{ConnectionPool, DB}

object ScalikeJDBCConnection extends LazyLogging {
  private def initSingleton(): Unit = {
    ConnectionPool.singleton(
      "jdbc:postgresql://127.0.0.1:61432/fullstack_playground_dev",
      "pguser",
      "secret",
    )
  }

  private lazy val singletonInited = initSingleton()

  val poolName = Symbol("pg")

  private def initNamed(): Unit = {
    ConnectionPool.add(
      poolName,
      "jdbc:postgresql://127.0.0.1:61432/fullstack_playground_dev",
      "pguser",
      "secret",
    )
  }

  private lazy val namedInited = initNamed()

  def showPools(): Unit = {
    logger.debug(s"initialized(default): ${ConnectionPool.isInitialized(Symbol("default"))}")
    logger.debug(s"initialized(pg): ${ConnectionPool.isInitialized(poolName)}")
  }

  def defaultDB() = {
    singletonInited
    DB
  }

  def namedDB() = {
    namedInited
    DB(ConnectionPool.borrow(poolName))
  }
}
