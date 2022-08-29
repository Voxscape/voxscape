package io.jokester.quill

import com.zaxxer.hikari.{HikariConfig, HikariDataSource}
import io.getquill.SnakeCase
import org.postgresql.ds.PGSimpleDataSource

import java.io.Closeable
import javax.sql.DataSource

object QuillDataSource {

  /** @param url
    *   JDBC URL like "jdbc:postgresql://localhost:61432/playground" (user / password in URL gets
    *   ignored)
    */
  def simplePgDataSource(
      url: String,
  ): PGSimpleDataSource with Closeable = {
    val pgDataSource = new PGSimpleDataSource() with Closeable {
      override def close(): Unit = {}
    }
    pgDataSource.setURL(url)
    pgDataSource
  }

  /** @note
    *   must be closed manually
    */
  def pooled(wrapped: DataSource): HikariDataSource = {
    val config = new HikariConfig()
    config.setDataSource(wrapped)
    //    config.setConnectionInitSql("set time zone 'UTC'")
    new HikariDataSource(config)
  }
}
