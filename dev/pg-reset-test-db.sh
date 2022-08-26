#!/usr/bin/env bash

cd $(dirname "$0")
set -uex

# rebuild test db to apply migrations without hasura

{
  cat <<'END'

  DROP DATABASE IF EXISTS "nuthatch_test" ;
  CREATE DATABASE "nuthatch_test" ;
  \c nuthatch_test;

END

  cat ../hasura/migrations/default/*/up.sql # in hopefully time-correct alphanum order

} | ./pg-psql.sh postgres --echo-all

