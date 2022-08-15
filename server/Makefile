apiSpec:
	sbt "apiServer/run writeOpenApiSpec ../api-spec/nuthatch-openapi.yaml"

migration:
	sbt flywayMigrate

models:
	sbt scalikejdbcGenAllForce scalafmtAll

bin:
	sbt apiServer/packageXzTarball

quillCodegen:
	rm -rf api-server/src/main/scala/io/jokester/nuthatch/quill/generated/
	sbt rdbCodegen/run

test:
	sbt clean coverageOn test coverageAggregate

packageTxz:
	sbt packageAllTxz
