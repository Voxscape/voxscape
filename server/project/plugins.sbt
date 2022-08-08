addSbtPlugin("org.scalameta" % "sbt-scalafmt"  % "2.4.0")
addSbtPlugin("org.scoverage" % "sbt-scoverage" % "1.6.1")

// packaging
addSbtPlugin("com.github.sbt" % "sbt-native-packager" % "1.9.6")

libraryDependencies += "org.postgresql" % "postgresql" % "42.3.1"

addSbtPlugin("org.scalikejdbc" %% "scalikejdbc-mapper-generator" % "3.5.0")

addSbtPlugin("io.github.davidmweber" % "flyway-sbt" % "7.4.0")

addDependencyTreePlugin
