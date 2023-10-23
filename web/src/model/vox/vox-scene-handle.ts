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

  createModelRootMesh(key: string | number, addToScene = true): Mesh {
    return new Mesh(`model-root-${key}`, addToScene ? this.scene : undefined);
  }

  addMesh(m: Mesh) {
    this.scene.addMesh(m);
  }

  async simplifyModel(
    rootMesh: Mesh,
    options?: {
      impl?: 'greedy';
      simplify?: ISimplificationSettings[];
    },
  ) {
    if (options?.simplify) {
      await new Promise((f) => rootMesh.optimizeIndices(f));
      rootMesh.getChildMeshes(true).forEach((child) => {
        if (!(child instanceof Mesh)) {
          logger('bypassing mesh', child);
          return;
        }

        child.simplify(options.simplify!, true, SimplificationType.QUADRATIC, (mesh, submeshIndex) => {
          logger(`mesh simplified`, mesh, submeshIndex);
          // TODO: see if this is called only once
        });
      });
    }
  }

  loadModel2(
    model: VoxTypes.VoxelModel,
    palette: VoxTypes.VoxelPalette,
    options?: {
      impl?: 'greedy';
      simplify?: ISimplificationSettings[];
    },
  ): {
    abortController: AbortController;
    loaded: Promise<{ interrupted: boolean; mesh: Mesh }>;
  } {
    const abortController = new AbortController();
    const x = greedyBuildMerged(model, palette, this.scene, `model-merged-${Date.now()}`);
    return {
      abortController,
      loaded: x.built.then((mesh) => ({ mesh, interrupted: false })),
    };
  }

  loadModel(
    model: VoxTypes.VoxelModel,
    palette: VoxTypes.VoxelPalette,
    rootMesh: Mesh,
    options?: {
      impl?: 'greedy';
      simplify?: ISimplificationSettings[];
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
