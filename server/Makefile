openapi:
	sbt "statelessOpenapi/run writeOpenApiSpec ../api-spec/todo-api.yaml"
	sbt "statedGraphqlOpenapi/run writeOpenApiSpec ../api-spec/user-todo-api.yaml"

migration:
	sbt flywayMigrate

models:
	sbt scalikejdbcGenAllForce scalafmtAll

bin:
	sbt statelessAkkaHttp/packageXzTarball statelessOpenapi/packageXzTarball statedGraphqlOpenapi/packageXzTarball

quillCodegen:
	rm -rf stated-graphql-openapi/src/main/scala/io/jokester/fullstack_playground/quill/generated/
	sbt rdbCodegen/run

test:
	sbt clean coverageOn test coverageAggregate

packageTxz:
	sbt packageAllTxz

image: packageTxz
	docker build --tag=fullplay-playground-scala-servers --file=./Dockerfile ./target/universal/
