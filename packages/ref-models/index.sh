#!/usr/bin/env bash
cd $(dirname "$0")

find -name '*.vox' | xargs ../vox.ts/bin/voxprobe > index.txt 2> index.err
