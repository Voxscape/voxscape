#!/usr/bin/env bash

<<END
### cheatsheet

$0 migrate apply                 # migrate
$0 migrate apply --down 1        # revert
$0 init .                        # run after removing all files, for a new start

###
END

set -ue
cd $(dirname "$0")

export HASURA_GRAPHQL_ENDPOINT='http://127.0.0.1:61080'
export HASURA_GRAPHQL_ADMIN_SECRET='super_secret_admin_secret'

set -x

pwd

exec ./node_modules/.bin/hasura "$@"
