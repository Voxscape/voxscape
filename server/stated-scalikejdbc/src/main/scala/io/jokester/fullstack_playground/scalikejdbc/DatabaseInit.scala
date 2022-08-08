package io.jokester.fullstack_playground.scalikejdbc

import com.typesafe.config.ConfigFactory
import com.typesafe.scalalogging.LazyLogging
import scalikejdbc.ConnectionPool

object DatabaseInit extends LazyLogging {

  lazy val setupDefault: Unit = {
    logger.info("initializing default db")
    doInitDb(loadCred("default"))
  }

  lazy val setupTest: Unit = {
    logger.info("initializing test db")
    doInitDb(loadCred("test"))
  }

  private case class DBCred(url: String, user: String, password: String)

  private def loadCred(key: String): DBCred = {
    val conf = ConfigFactory.load()

    DBCred(
      conf.getString(s"database.$key.url"),
      conf.getString(s"database.$key.user"),
      conf.getString(s"database.$key.password"),
    )

  }

  private def doInitDb(cred: DBCred): Unit = {
    ConnectionPool.add(
      name = ConnectionPool.DEFAULT_NAME,
      url = cred.url,
      user = cred.user,
      password = cred.password,
    )
  }
}
