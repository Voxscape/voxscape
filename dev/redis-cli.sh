#!/usr/bin/env bash
cd $(dirname "$0")

exec docker-compose exec redis redis-cli "$@"
