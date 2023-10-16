import { Mesh, Scene } from '@babylonjs/core';
import * as VoxTypes from '../../types/vox-types';

export function greedyBuildMerged(
  model: VoxTypes.VoxelModel,
  palette: VoxTypes.VoxelPalette,
  scene: Scene,
  options?: {
    abortSignal?: AbortSignal;
    swapYz?: boolean;
  },
): { built: Promise<Mesh>, stopped: Promise<boolean> } {
  // TODO: build multiple mesh for each colorIndex, and merge with
  // https://doc.babylonjs.com/features/featuresDeepDive/mesh/mergeMeshes
  // (this should support auto LoD and automatic mesh optimization better)
  throw new Error(`TODO`)
}
