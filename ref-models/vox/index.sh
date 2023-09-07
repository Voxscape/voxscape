#!/usr/bin/env bash
cd $(dirname "$0")

find . -name '*.vox' | xargs ../../packages/vox.ts/bin/voxprobe > index.ndjson 2> index.err
