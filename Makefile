SHELL := /bin/bash

.PHONY: apiSpec web

sleep:
	@printf '\ek[SLEEP]\e\\' && sleep 1000

apiSpec:
	cd server && sbt "apiServer/run writeOpenApiSpec ../api-spec/nuthatch-openapi.yaml"

web:
	@printf '\ek[npm run dev]\e\\'
	cd web && npm i && exec npm run dev

devDeps:
	@printf '\ek[docker-compose up]\e\\'
	cd dev && exec docker-compose up

serverTxz:
	cd server && exec sbt apiServer/packageXzTarball

webCodegen:
	cd scripts && exec ./openapi-codegen.sh

quillCodegen:
	cd server \
		&& rm -rf api-server/src/main/scala/io/jokester/nuthatch/quill/generated/ \
		&& sbt rdbCodegen/run

sbt:
	@printf '\ek[sbt]\e\\'
	cd server && source .env && exec sbt

serverTest:
	cd server && sbt clean coverageOn test coverageAggregate
