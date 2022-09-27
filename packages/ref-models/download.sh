#!/usr/bin/env bash
set -uex
cd $(dirname "$0")

# $1: zip URL to download
# $2: local filename
fetch-models () {
  if [[ ! -f "$2" ]]; then
    wget "$1" -O "$2" --continue
  fi
  unzip -o "$2"
}

# => voxel-model-master/
fetch-models https://github.com/ephtracy/voxel-model/archive/refs/heads/master.zip ephtracy-voxel-model-master.zip &
# => voxel-model-master/
fetch-models https://github.com/lquesada/voxel-3d-models/archive/refs/heads/master.zip lquesada-voxel-3d-models-master.zip &
fetch-models https://github.com/kluchek/vox-models/archive/refs/heads/master.zip kluchek-vox-models-master.zip &
wait
