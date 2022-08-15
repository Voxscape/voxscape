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

addCompilerPlugin("com.olegpy" %% "better-monadic-for" % "0.3.1")

resolvers += "GCP maven mirror" at "https://maven-central-asia.storage-download.googleapis.com/repos/central/data/"

lazy val scalaCommons = (project in file("scala-commons"))
  .settings(
    name := "scalaCommons",
    libraryDependencies ++= Seq(
      basicDeps,
      http4sDeps,
      circeDeps,
      tapirDeps,
      authDeps,
      quillDeps,
      testDeps,
    ).flatten,
    dependencyOverrides ++= Seq.empty,
//    excludeDependencies ++= incompatibleDependencies,
  )

lazy val apiServer = (project in file("api-server"))
  .settings(
    name := "api-server",
    libraryDependencies ++= Seq(
      basicDeps,
      http4sDeps,
      circeDeps,
      tapirDeps,
      authDeps,
      quillDeps,
      redisDeps,
      oauthDeps,
      catsDeps,
      testDeps,
    ).flatten,
  )
  .dependsOn(scalaCommons)
  .enablePlugins(
    // see http://scalikejdbc.org/documentation/reverse-engineering.html
    // (not generating prefect code)
    ScalikejdbcPlugin,
  )
  .enablePlugins(JavaAppPackaging)

lazy val rdbCodegen = (project in file("rdb-codegen"))
  .settings(
    name := "rdb-codegen",
    libraryDependencies ++= basicDeps ++ quillCodegenDeps ++ circeDeps,
  )

lazy val enableQuillLog = taskKey[Unit]("enable quill logs")
enableQuillLog := {
  System.err.println("enable quill log")
  sys.props.put("quill.macro.log", false.toString)
  sys.props.put("quill.binds.log", true.toString)
}
