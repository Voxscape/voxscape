import { createDebugLogger } from '../../../shared/logger';
import type * as VoxTypes from '@voxscape/vox.ts/src/types/vox-types';
import { getDefaultPalette } from '@voxscape/vox.ts/src/parser/chunk-reader';
import { greedyBuild } from '@voxscape/vox.ts/src/mesh-builder/babylonjs/mesh-builder-greedy';
import { BabylonSceneHandle } from '../_babylon/babylon-scene-handle';

const logger = createDebugLogger(__filename);

/**
 * vox-specific functions
 */
export class VoxSceneHandle extends BabylonSceneHandle {
  createModelRefAxes(model: VoxTypes.VoxelModel) {
    this.createRefAxes(1.2 * Math.max(model.size.x, model.size.y, model.size.z));
  }

  async loadModel(
    voxFile: VoxTypes.ParsedVoxFile,
    modelIndex: number,
    options?: {
      impl?: 'greedy';
      shouldStop?: () => boolean;
    },
  ) {
    const palette = voxFile.palette ?? getDefaultPalette();
    const meshName = `vox-model-${modelIndex}`;
    return greedyBuild(voxFile.models[modelIndex], palette, meshName, this.scene, {
      shouldStop: options?.shouldStop,
    });
  }
}
