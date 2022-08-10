package io.jokester.scala_commons.quill

import com.zaxxer.hikari.{HikariConfig, HikariDataSource}
import io.getquill.SnakeCase
import org.postgresql.ds.PGSimpleDataSource

import javax.sql.DataSource

trait QuillDataSource {

  /**
    * how table/columns are escaped in SQL
    */
  object FixedPostgresNaming extends SnakeCase {
    override def table(s: String): String = s"""\"${super.table(s)}\""""

    override def column(s: String): String = s"""\"${super.column(s)}\""""
  }

  /**
    * @param url JDBC URL like "jdbc:postgresql://localhost:61432/playground"
    *            (user / password in URL gets ignored)
    * @return
    */
  protected def simplePgDataSource(
      url: String,
      user: String,
      password: String,
  ): PGSimpleDataSource = {
    val pgDataSource = new PGSimpleDataSource()
    pgDataSource.setURL(url)
    pgDataSource.setUser(user)
    pgDataSource.setPassword(password)
    pgDataSource
  }

  protected def poolePgDataSource(
      url: String,
      user: String,
      password: String,
  ): HikariDataSource = {

    hikariDataSource(
      simplePgDataSource(
        url,
        user,
        password,
      ),
    )

  }

  /**
    * @note must be closed manually
    */
  protected def hikariDataSource(wrapped: DataSource): HikariDataSource = {
    val config = new HikariConfig()
    config.setDataSource(wrapped)
    //    config.setConnectionInitSql("set time zone 'UTC'")
    new HikariDataSource(config)
  }
}
