#!/usr/bin/env bash
set -uex
cd $(dirname "$0")

exec nginx -c $PWD/nginx.conf
