import { ArcRotateCamera, Engine, Scene } from '@babylonjs/core';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { createArcRotateCamera } from '@voxscape/vox.ts/src/demo/babylon/babylon-context';
import { BabylonEngineRef } from './use-babylon-engine';
import { createDebugLogger } from '../../../shared/logger';
import { useDeferred } from '../../hooks/use-deferred';
import { useAsyncEffect2 } from '../../hooks/use-async-effect2';

const logger = createDebugLogger(__filename);

const nextTick = Promise.resolve(1);

class VoxSceneHandle {
  #closed = false;
  constructor(
    private readonly engine: Engine,
    readonly scene: Scene,
  ) {
    logger(`VoxSceneHandler: created`);
  }

  createArcRotateCamera() {
    const camera = createArcRotateCamera(this.scene);
    this.scene.setActiveCameraById(camera.id);
    return camera;
  }

  setCameraRadius(camera: ArcRotateCamera, lowerDistance: number, upper = lowerDistance) {
    camera.lowerRadiusLimit = lowerDistance;
    camera.upperRadiusLimit = upper;
    camera.radius = 0.5 * (lowerDistance + upper);
  }

  dispose() {
    if (this.#closed) {
      return;
    }
    this.#closed = true;
    logger(`VoxSceneHandler: dispose()`);
    try {
      this.stopRenderLoop();
      this.scene.dispose();
    } catch (e) {
      logger(`VoxSceneHandler: dispose() error`);
      logger(e);
    }
  }

  async toggleInspector(enabled: boolean) {
    await Promise.race([import('@babylonjs/core/Debug/debugLayer'), import('@babylonjs/inspector')]);
    if (this.#closed) {
      return;
    }
    if (enabled) {
      await this.scene.debugLayer.show();
    } else {
      this.scene.debugLayer.hide();
    }
  }

  startRenderLoop() {
    this.engine.stopRenderLoop();
    this.engine.runRenderLoop(() => this.scene.render());
  }
  stopRenderLoop() {
    this.engine.stopRenderLoop();
  }
}

export function useVoxScene(engineRef: BabylonEngineRef): PromiseLike<VoxSceneHandle> {
  const value = useDeferred<VoxSceneHandle>();

  useAsyncEffect2(
    async (running, released) => {
      const engine = await Promise.race([released, engineRef.initialized]);
      if (!engine) {
        return;
      }

      const scene = new Scene(engine);
      const handle = new VoxSceneHandle(engine, scene);
      handle.startRenderLoop();
      value.fulfill(handle);

      await released;
      handle.dispose();
    },
    [value, engineRef],
    true,
  );

  return value;
}
