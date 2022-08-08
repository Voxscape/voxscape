#!/bin/bash

set -ue

source "$(dirname "$0")/pg-cred"

if [[ $# -gt 0 ]]; then
  echo "connecting to DB_NAME=$1"
  set -x
  exec psql "$@"
else
  echo "connecting to DB_NAME=postgres"
  set -x
  exec psql postgres "$@"
fi
