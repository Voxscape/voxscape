import { createDebugLogger } from '../../../shared/logger';
import type * as VoxTypes from '@voxscape/vox.ts/src/types/vox-types';
import { greedyBuild } from '@voxscape/vox.ts/src/mesh-builder/babylonjs/mesh-builder-greedy';
import { BabylonSceneHandle } from '../_babylon/babylon-scene-handle';
import { ISimplificationSettings, Mesh } from '@babylonjs/core';

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

  loadModel(
    model: VoxTypes.VoxelModel,
    palette: VoxTypes.VoxelPalette,
    rootMesh: Mesh,
    options?: {
      impl?: 'greedy';
      simiplify?: ISimplificationSettings[];
    },
  ): {
    abortController: AbortController;
    loaded: Promise<{ interrupted: boolean; mesh?: Mesh }>;
  } {
    const abortController = new AbortController();
    const { stopped } = greedyBuild(model, palette, rootMesh, this.scene, { abortSignal: abortController.signal });

    const loaded = stopped.then(async (interrupted) => {
      if (interrupted) {
        return { interrupted };
      }

      if (options?.simiplify) {
        await new Promise<void>((f) =>
          rootMesh.simplify([], true, undefined, (mesh, submeshIndex) => {
            logger(`mesh simplified`, mesh, submeshIndex);
            // TODO: see if this is called only once
            f();
          }),
        );
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
