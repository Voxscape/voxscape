import * as VoxTypes from '../types/vox-types';
import type { Scene } from '@babylonjs/core/scene';
import { BabylonDeps } from './babylon-deps';
import { Iterators } from '../util/iterator';
import { BabylonMeshBuildProgress, buildBabylonMeshProgressive } from './babylon-mesh-builder-progressive';

export const BabylonMeshBuilder = {
  progessive: buildBabylonMeshProgressive,
  sync(
    model: VoxTypes.VoxelModel,
    palette: VoxTypes.VoxelPalette,
    meshName: string,
    scene: Scene,
    deps: BabylonDeps,
  ): BabylonMeshBuildProgress {
    return Iterators.last(buildBabylonMeshProgressive(model, palette, meshName, scene, deps, 100))!;
  },

  async async(
    model: VoxTypes.VoxelModel,
    palette: VoxTypes.VoxelPalette,
    meshName: string,
    scene: Scene,
    deps: BabylonDeps,
  ) {
    const all = await Iterators.toArrayAsync(buildBabylonMeshProgressive(model, palette, meshName, scene, deps), 0.1e3);
    return all[all.length - 1];
  },
} as const;
