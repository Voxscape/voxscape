import sbt.librarymanagement.{DependencyBuilders, InclExclRule}
import sbt._

object Dependencies {
  lazy val basicDeps: Seq[ModuleID] = Seq(
    // logging
    "com.typesafe.scala-logging" %% "scala-logging"  % "3.9.5",
    "org.slf4j"                   % "jcl-over-slf4j" % "1.7.36",
    "org.slf4j"                   % "slf4j-api"      % "1.7.36",
    "ch.qos.logback"  % "logback-classic" % "1.3.0-alpha10", // this provides SLF4J backend
    "commons-logging" % "commons-logging" % "1.2",
    // config
    "com.typesafe" % "config" % "1.4.2",
  )

  lazy val akkaDeps: Seq[ModuleID] = Seq(
    // akka
    "com.typesafe.akka" %% "akka-stream"        % Versions.akka,
    "com.typesafe.akka" %% "akka-actor-typed"   % Versions.akka,
    "com.typesafe.akka" %% "akka-stream-typed"  % Versions.akka,
    "com.typesafe.akka" %% "akka-slf4j"         % Versions.akka,
    "com.typesafe.akka" %% "akka-cluster-typed" % Versions.akka,
    "ch.megard"         %% "akka-http-cors"     % "1.1.3",
    "com.typesafe.akka" %% "akka-http"          % Versions.akkaHttp,
    "de.heikoseeberger" %% "akka-http-circe"    % "1.39.2",
  ).map(_.cross(CrossVersion.for3Use2_13))

  /** drop 2.13 when CrossVersion included multiple variants
    */
  lazy val incompatibleDependencies: Seq[DependencyBuilders.OrganizationArtifactName] = Seq(
    "com.typesafe.scala-logging" % "scala-logging_2.13",
    "io.circe"                   % "circe-core_2.13",
    "io.circe"                   % "circe-generic_2.13",
    "io.circe"                   % "circe-parser_2.13",
    "org.scala-lang.modules"     % "scala-java8-compat_2.13",
  )

  lazy val circeDeps: Seq[ModuleID] = Seq(
    // circe
    "io.circe" %% "circe-core",
    "io.circe" %% "circe-generic",
    "io.circe" %% "circe-parser",
  ).map(_ % Versions.circe)

  lazy val authDeps: Seq[ModuleID] = Seq(
    "org.springframework.security" % "spring-security-crypto" % Versions.spring,
  )

  lazy val tapirDeps: Seq[ModuleID] = Seq(
    // tapir as server
    "com.softwaremill.sttp.tapir" %% "tapir-core",
    "com.softwaremill.sttp.tapir" %% "tapir-json-circe",
    "com.softwaremill.sttp.tapir" %% "tapir-openapi-docs",
    "com.softwaremill.sttp.tapir" %% "tapir-swagger-ui-bundle",
    "com.softwaremill.sttp.tapir" %% "tapir-akka-http-server",
  ).map(_ % Versions.tapir)
    .map(_.cross(CrossVersion.for3Use2_13)) :+ ("com.github.jwt-scala" %% "jwt-circe" % "9.0.6")
  //      "com.softwaremill.sttp.client3" %% "core"            % Versions.sttp

  lazy val quillDeps: Seq[ModuleID] = Seq(
    "com.zaxxer"     % "HikariCP"   % "5.0.1",
    "org.postgresql" % "postgresql" % Versions.postgresql,
    "io.getquill"   %% "quill-jdbc" % Versions.quill,
    //    "io.getquill"   %% "quill-async-postgres" % Versions.quill,
  )

  lazy val quillCodegenDeps: Seq[ModuleID] = Seq(
    "org.postgresql" % "postgresql" % Versions.postgresql,
    //    "io.getquill"   %% "quill-jdbc"           % Versions.quill,
    ("io.getquill" %% "quill-codegen-jdbc" % Versions.quill).cross(CrossVersion.for3Use2_13),
  )

  lazy val scalikeJdbcDeps: Seq[ModuleID] = Seq(
    // pgsql / hikariCP
    "org.postgresql" % "postgresql" % Versions.postgresql,
    //      "com.zaxxer"     % "HikariCP"   % "4.0.1", // this resolves to bad version
    "org.scalikejdbc" %% "scalikejdbc" % Versions.scalikeJDBC,
  )

  lazy val testDeps: Seq[ModuleID] = Seq(
    "org.scalatest"       %% "scalatest"        % Versions.scalaTest,
    "org.scalikejdbc"     %% "scalikejdbc-test" % Versions.scalikeJDBC,
    "com.github.javafaker" % "javafaker"        % "1.0.2",
  ).map(_ % Test)

  /** @deprecated
    */
  lazy val buildDeps: Seq[ModuleID] = Seq.empty
}

private object Versions {
  val circe     = "0.14.2"
  val circeYaml = "0.13.1"

  val tapir = "1.0.4" // FIXME: use released version

  val akkaHttp  = "10.2.9"
  val akka      = "2.6.19"
  val swaggerUi = "3.35.2"
  val upickle   = "1.2.2"

  // rdbms
  val postgresql  = "42.3.6"
  val quill       = "4.3.0"
  val scalikeJDBC = "3.5.0"
  val flyway      = "8.0.2"

  // utils
  val spring = "5.7.2"

  // testing
  val scalaTest               = "3.2.12"
  val scalaTestPlusScalaCheck = "3.2.2.0"

}
