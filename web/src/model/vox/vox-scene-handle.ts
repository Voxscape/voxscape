import { createDebugLogger } from '../../../shared/logger';
import type * as VoxTypes from '@voxscape/vox.ts/src/types/vox-types';
import { greedyBuild } from '@voxscape/vox.ts/src/mesh-builder/babylonjs/mesh-builder-greedy';
import { greedyBuildMerged } from '@voxscape/vox.ts/src/mesh-builder/babylonjs/mesh-builder-greedy-merged';
import { BabylonSceneHandle } from '../_babylon/babylon-scene-handle';
import { ISimplificationSettings, Mesh, Scene, SimplificationType } from '@babylonjs/core';

const logger = createDebugLogger(__filename);

/**
 * vox-specific functions
 */
export class VoxSceneHandle extends BabylonSceneHandle {
  createModelRefAxes(model: VoxTypes.VoxelModel): Mesh {
    return this.createRefAxes(1.2 * Math.max(model.size.x, model.size.y, model.size.z));
  }

  loadModel(
    model: VoxTypes.VoxelModel,
    palette: VoxTypes.VoxelPalette,
  ): {
    abortController: AbortController;
    loaded: Promise<{ interrupted: boolean; mesh: Mesh }>;
  } {
    const abortController = new AbortController();

    const buildResult = greedyBuildMerged(model, palette, this.scene, { abortSignal: abortController.signal });
    return {
      abortController,
      loaded: buildResult.built.then((mesh) => ({ mesh, interrupted: false })),
    };
  }

  /** @deprecated this has no mesh merging */
  loadModelLegacy(
    model: VoxTypes.VoxelModel,
    palette: VoxTypes.VoxelPalette,
    rootMesh: Mesh,
    options?: {
      impl?: 'greedy';
    },
  ): {
    abortController: AbortController;
    loaded: Promise<{ interrupted: boolean; mesh?: Mesh }>;
  } {
    const abortController = new AbortController();
    const { stopped } = greedyBuild(model, palette, rootMesh, this.scene, { abortSignal: abortController.signal });

    const loaded = stopped.then(async (interrupted) => {
      logger('greedyBuild() done', rootMesh, interrupted);

      if (interrupted) {
        return { interrupted };
      }

      return {
        interrupted: false,
        mesh: rootMesh,
      };
    });

    return {
      abortController,
      loaded,
    };
  }
}
