import * as VoxTypes from '../types/vox-types';
import type { Scene } from '@babylonjs/core/scene';
import { BabylonDeps } from './babylon-deps';
import { Iterators } from '../util/iterator';
import { BabylonMeshBuildProgress, buildBabylonMeshProgressive } from './babylon-mesh-builder-progressive';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';

function* buildMeshes(
  model: VoxTypes.VoxelModel,
  palette: VoxTypes.VoxelPalette,
  meshName: string,
  scene: Scene,
  deps: BabylonDeps,
): IterableIterator<void> {
  yield;

  const meshIndex = new MeshIndex(model);

  {
    const prevLayer: null | Set<string> = null;

    // facets paralle to YoZ , looking from +x direction
    for (let x = 0; x < model.size.x; x++) {
      const consumed: Set<string> = new Set();
      // sorted by y then z
      const layer = meshIndex.xLayers.get(x)!.slice();

      const ordered = layer.sort((v1, v2) => v1.y - v2.y || v1.z - v2.z);
    }
  }
}

class MeshIndex {
  readonly xLayers: ReadonlyMap<number, readonly VoxTypes.Voxel[]>;
  readonly yLayers: ReadonlyMap<number, readonly VoxTypes.Voxel[]>;
  readonly zLayers: ReadonlyMap<number, readonly VoxTypes.Voxel[]>;
  constructor(private readonly model: VoxTypes.VoxelModel) {
    this.xLayers = new DefaultMap((x) => model.voxels.filter((v) => v.x === x).sort((a, b) => a.y - b.y || a.z - b.z));
    this.yLayers = new DefaultMap((y) => model.voxels.filter((v) => v.y === y).sort((a, b) => a.z - b.z || a.x - b.x));
    this.zLayers = new DefaultMap((z) => model.voxels.filter((v) => v.z === z).sort((a, b) => a.x - b.x || a.y - b.y));
  }
}

interface QuadState {
  axis: 'x' | 'y' | 'z';
  direction: 1 | -1;
}
