SHELL := /bin/bash

apiSpec:
	cd server && sbt "apiServer/run writeOpenApiSpec ../api-spec/nuthatch-openapi.yaml"

serverTxz:
	cd server && sbt apiServer/packageXzTarball

webCodegen:
	cd scripts && ./openapi-codegen.sh

quillCodegen:
	cd server \
		&& rm -rf api-server/src/main/scala/io/jokester/nuthatch/quill/generated/ \
		&& sbt rdbCodegen/run

sbt:
	cd server && source .env && exec sbt

serverTest:
	cd server && sbt clean coverageOn test coverageAggregate
