package io.jokester.fullstack_playground.rdb_codegen

import com.typesafe.scalalogging.LazyLogging
import io.getquill.codegen.jdbc.{ComposeableTraitsJdbcCodegen, SimpleJdbcCodegen}
import io.getquill.codegen.model._
import org.postgresql.ds.PGSimpleDataSource

/**
  * A to run code generation (before I learned better way)
  */
object RdbCodegenMain extends App with LazyLogging {
  logger.debug("started")

  val destPkg = "io.jokester.fullstack_playground.quill.generated"

  lazy val simplePgDataSource = {
    val pgDataSource = new PGSimpleDataSource()
    pgDataSource.setURL(
      "jdbc:postgresql://localhost:61432/playground?user=pguser&password=secret&ssl=false",
    )
    pgDataSource
  }

  lazy val simpleCodeGen =
    new SimpleJdbcCodegen(simplePgDataSource, packagePrefix = destPkg) {
      override def nameParser: NameParser = SnakeCaseNames
    }

  lazy val traitsCodeGen = {
    new ComposeableTraitsJdbcCodegen(
      simplePgDataSource,
      packagePrefix = destPkg,
      nestedTrait = true,
    ) {
//      override def defaultNamespace: String = "public"

      /**
        * how columns are named at "Scala side"
        * override def generateQuerySchemas=true to generate explicit schemas
        */
      override def nameParser: NameParser = CustomNames()

      /**
        * how generated files are names / organized
        */
      override def packagingStrategy: PackagingStrategy = {
        PackagingStrategy.ByPackageHeader
          .TablePerSchema(destPkg)
          .copy(
            packageNamingStrategyForQuerySchemas =
              PackageHeaderByNamespace(destPkg, _.table.namespace),
          )
      }

      /**
        * whether to generate code for `tc`
        */
      override def filter(tc: RawSchema[JdbcTableMeta, JdbcColumnMeta]): Boolean =
        super.filter(tc) && !tc.table.tableSchem.exists(_.matches("hdb_catalog"))

      /**
        * how JDBC columns are mapped to JVM types
        */
      override def typer: Typer = new OurPostgresTyper(unrecognizedTypeStrategy, numericPreference)

      /**
        * what to do when `Typer` returns None
        * `ThrowTypingError` fails early
        */
      override def unrecognizedTypeStrategy: UnrecognizedTypeStrategy = ThrowTypingError

      /**
        * not making difference?
        */
      override val columnGetter: JdbcColumnMeta => String = cm => "WHAT DOES THIS DO???"

//      override def namespacer: Namespacer[JdbcTableMeta] = ts => ts.tableSchem.getOrElse("public")

//      override def querySchemaNaming: JdbcQuerySchemaNaming = super.querySchemaNaming
    }
  }

  traitsCodeGen.writeFiles(location =
    "stated-graphql-openapi/src/main/scala/" + destPkg.split("\\.").mkString("/"),
  )
}
