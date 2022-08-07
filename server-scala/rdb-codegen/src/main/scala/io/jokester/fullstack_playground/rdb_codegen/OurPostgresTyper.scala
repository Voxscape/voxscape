package io.jokester.fullstack_playground.rdb_codegen

import com.typesafe.scalalogging.LazyLogging
import io.circe.Json
import io.getquill.codegen.jdbc.model.{DefaultJdbcTyper, JdbcTypeInfo}
import io.getquill.codegen.model.{NumericPreference, UnrecognizedTypeStrategy}

import java.sql.{Types => JDBCTypes}
import java.time.OffsetDateTime
import java.util.UUID
import scala.reflect.{ClassTag, classTag}

class OurPostgresTyper(
    strategy: UnrecognizedTypeStrategy,
    numericPreference: NumericPreference,
) extends DefaultJdbcTyper(strategy, numericPreference)
    with LazyLogging {
  override def apply(jdbcTypeInfo: JdbcTypeInfo): Option[ClassTag[_]] = {
    logger.debug("jdbcTypeInfo: {}", jdbcTypeInfo)
    val typed = jdbcTypeInfo match {

      /**
        * @see https://jdbc.postgresql.org/documentation/head/8-date-time.html
        */
      case JdbcTypeInfo(JDBCTypes.TIMESTAMP, size, Some("timestamptz")) =>
        Some(classTag[OffsetDateTime])
      case JdbcTypeInfo(JDBCTypes.OTHER, size, Some("json")) =>
        Some(classTag[Json])
      case JdbcTypeInfo(JDBCTypes.OTHER, size, Some("jsonb")) =>
        Some(classTag[Json])
      case JdbcTypeInfo(JDBCTypes.OTHER, size, Some("uuid")) =>
        Some(classTag[UUID])
      case _ => super.apply(jdbcTypeInfo)
    }
    logger.debug("mapping {} to {}", jdbcTypeInfo, typed)
    typed
  }
}
