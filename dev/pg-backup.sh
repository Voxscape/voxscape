#!/bin/bash

set -ue

source "$(dirname "$0")/pg-cred"
NOW=$(date '+%Y%m%d-%H%M%S-%N')

if [[ $# -gt 0 ]]; then
  echo "using DB_NAME=$1"
  DB_NAME="$1"
  shift
  set -x
  pg_dump "$DB_NAME" | xz -9 > "$DB_NAME-$NOW.sql.xz"
else
  echo "USAGE: $0 DB_NAME"
  exit 1
fi
