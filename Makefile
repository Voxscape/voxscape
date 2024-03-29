SHELL := /bin/bash

.PHONY: apiSpec web

sleep:
	@printf '\ek[SLEEP]\e\\' && sleep 1000

apiClient: apiSpec
	cd scripts && ./openapi-codegen.sh

apiSpec:
	cd server && sbt "apiServer/run writeOpenApiSpec ../api-spec/nuthatch-openapi.yaml"

web:
	@printf '\ek[web]next dev\e\\'
	cd web && yarn && exec yarn dev

voxPreview:
	@printf '\ek[voxPreview]next dev\e\\'
	cd packages/vox.ts && yarn && exec yarn dev

webTsc:
	@printf '\ek[web]tsc watch\e\\'
	cd web && exec yarn typecheck:watch

devDeps:
	@printf '\ek[docker-compose up]\e\\'
	cd dev && exec docker-compose up

devDepsFull:
	@printf '\ek[docker-compose up]\e\\'
	cd dev && COMPOSE_PROFILES=NOAUTO exec docker-compose up

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
