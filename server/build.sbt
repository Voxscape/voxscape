import Dependencies._

val scala2Version = "2.13.7"
val scala3Version = "3.1.3" // FIXME: wait for quill-codegen to generate for scala3

// "bare" definition, applies to all projects
ThisBuild / version          := "current"
ThisBuild / organization     := "io.jokester.nuthatch"
ThisBuild / organizationName := "gh/jokester/nuthatch"
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
      twitterSdkDeps,
      testDeps,
      gcpDeps,
    ).flatten,
    excludeDependencies ++= incompatibleDependencies,
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
//    excludeDependencies ++= incompatibleDependencies,
  )

lazy val enableQuillLog = taskKey[Unit]("enable quill logs")
enableQuillLog := {
  System.err.println("enable quill log")
  sys.props.put("quill.macro.log", false.toString)
  sys.props.put("quill.binds.log", true.toString)
}
