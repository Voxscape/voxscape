import Dependencies._

val scala2Version = "2.13.7"
val scala3Version = "3.1.3" // TODO: try to compile with scala3 when our deps are good with 3

// "bare" definition, applies to all projects
ThisBuild / version          := "current"
ThisBuild / organization     := "io.jokester.fullstack_playground"
ThisBuild / organizationName := "gh/jokester/fullstack-playground"
ThisBuild / scalaVersion     := scala2Version
ThisBuild / scalacOptions ++= Seq("-Xlint")
//ThisBuild / coverageEnabled := true // this is not the way to do it. should "sbt coverageOn" instead

lazy val scalaCommons = (project in file("scala-commons"))
  .settings(
    name := "scalaCommons",
    libraryDependencies ++= basicDeps ++ akkaDeps ++ circeDeps ++ tapirDeps ++ authDeps ++ quillDeps,
//    excludeDependencies ++= incompatibleDependencies,
  )

lazy val statelessAkkaHttp = (project in file("stateless-akka-http"))
  .settings(
    name := "stateless-akka-http",
    libraryDependencies ++= basicDeps ++ akkaDeps ++ circeDeps,
    Universal / target := file("target/universal"),
  )
  .enablePlugins(JavaAppPackaging)
  .dependsOn(scalaCommons)

lazy val statelessOpenapi = (project in file("stateless-openapi"))
  .settings(
    name := "stateless-openapi",
    libraryDependencies ++= basicDeps ++ akkaDeps ++ circeDeps ++ tapirDeps ++ testDeps ++ authDeps,
    Universal / target := file("target/universal"),
  )
  .enablePlugins(JavaAppPackaging)
  .dependsOn(statelessAkkaHttp, scalaCommons)

lazy val statedGraphqlOpenapi = (project in file("stated-graphql-openapi"))
  .settings(
    name := "stated-graphql-openapi",
    libraryDependencies ++= basicDeps ++ akkaDeps ++ circeDeps ++ tapirDeps ++ quillDeps ++ testDeps,
    Universal / target := file("target/universal"),
  )
  .enablePlugins(JavaAppPackaging)
  .dependsOn(statelessAkkaHttp, statelessOpenapi % "compile->compile;test->test;", scalaCommons)

lazy val rdbCodegen = (project in file("rdb-codegen"))
  .settings(
    name := "rdb-codegen",
    libraryDependencies ++= basicDeps ++ quillCodegenDeps ++ circeDeps,
  )

lazy val legacyScalikeJdbc = (project in file("stated-scalikejdbc"))
  .settings(
    name := "stated-scalikejdbc",
    libraryDependencies ++= basicDeps ++ akkaDeps ++ circeDeps ++ tapirDeps ++ scalikeJdbcDeps ++ testDeps,
  )
  .enablePlugins(
    // see http://scalikejdbc.org/documentation/reverse-engineering.html
    // (not generating prefect code)
    ScalikejdbcPlugin,
  )
  .dependsOn(statelessAkkaHttp, statelessOpenapi % "compile->compile;test->test;", scalaCommons)

lazy val enableQuillLog = taskKey[Unit]("enable quill logs")
enableQuillLog := {
  System.err.println("enable quill log")
  sys.props.put("quill.macro.log", false.toString)
  sys.props.put("quill.binds.log", true.toString)
}
(statedGraphqlOpenapi / Compile / run) := ((statedGraphqlOpenapi / Compile / run) dependsOn enableQuillLog).evaluated

{
  lazy val packageAllTxz = taskKey[Unit]("package all txz in parallel")
  packageAllTxz dependsOn ()
  packageAllTxz := {
    (statelessAkkaHttp / Universal / packageXzTarball).value
    (statelessOpenapi / Universal / packageXzTarball).value
    (statedGraphqlOpenapi / Universal / packageXzTarball).value
  }
}
