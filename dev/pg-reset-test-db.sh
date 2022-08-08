#!/usr/bin/env bash

cd $(dirname "$0")
set -uex

# rebuild test db to apply migrations without hasura

{
  cat <<'END'

  DROP DATABASE IF EXISTS "playground_test" ;
  CREATE DATABASE "playground_test" ;
  \c playground_test;

END

  cat ../hasura/migrations/default/*/up.sql # in hopefully time-correct alphanum order

} | ./pg-psql.sh postgres --echo-all

