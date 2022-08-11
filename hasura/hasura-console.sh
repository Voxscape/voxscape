#!/usr/bin/env bash

set -ue
cd "$(dirname "$0")"

export HASURA_GRAPHQL_ENDPOINT='http://127.0.0.1:62080'
export HASURA_GRAPHQL_ADMIN_SECRET='super_secret_admin_secret'

set -x
exec npm run hasura console "$@"
