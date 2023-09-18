import { createDebugLogger } from '../../../shared/logger';
import type * as VoxTypes from '@voxscape/vox.ts/src/types/vox-types';
import { greedyBuild } from '@voxscape/vox.ts/src/mesh-builder/babylonjs/mesh-builder-greedy';
import { BabylonSceneHandle } from '../_babylon/babylon-scene-handle';
import { Mesh } from '@babylonjs/core';

const logger = createDebugLogger(__filename);

/**
 * vox-specific functions
 */
export class VoxSceneHandle extends BabylonSceneHandle {
  createModelRefAxes(model: VoxTypes.VoxelModel): Mesh {
    return this.createRefAxes(1.2 * Math.max(model.size.x, model.size.y, model.size.z));
  }

  createModelRootMesh(key: string | number): Mesh {
    return new Mesh(`model-root-${key}`, this.scene);
  }

  loadModel(
    model: VoxTypes.VoxelModel,
    palette: VoxTypes.VoxelPalette,
    rootMesh: Mesh,
    options?: {
      impl?: 'greedy';
    },
  ): {
    stop(): void;
    mesh: Mesh;
    stopped: Promise<void>;
  } {
    let running = true;
    const { stop, stopped } = greedyBuild(model, palette, rootMesh, this.scene);
    return {
      stop,
      stopped,
      mesh: rootMesh,
    };
  }
}
