openapi:
	sbt "statelessOpenapi/run writeOpenApiSpec ../api-spec/todo-api.yaml"
	sbt "statedGraphqlOpenapi/run writeOpenApiSpec ../api-spec/user-todo-api.yaml"

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

image: packageTxz
	docker build --tag=fullplay-playground-scala-servers --file=./Dockerfile ./target/universal/
