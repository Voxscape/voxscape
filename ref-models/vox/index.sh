#!/usr/bin/env bash
set -ue
cd $(dirname "$0")/../../packages/vox.ts

exec yarn ts-node src/scripts/create-ref-model-index.ts
