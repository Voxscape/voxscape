import { ArcRotateCamera, Color3, Color4, Engine, HemisphericLight, Scene, Vector3 } from '@babylonjs/core';
import {
  createArcRotateCamera,
  createDefaultLight,
  createDefaultScene,
  startRunLoop,
} from '@voxscape/vox.ts/src/demo/babylon/babylon-context';
import { BabylonEngineRef } from './use-babylon-engine';
import { createDebugLogger } from '../../../shared/logger';
import { useDeferred } from '../../hooks/use-deferred';
import { useAsyncEffect2 } from '../../hooks/use-async-effect2';
import { createRefAxes } from '@voxscape/vox.ts/src/demo/babylon/create-ref-axes';
import * as VoxTypes from '@voxscape/vox.ts/src/types/vox-types';

const logger = createDebugLogger(__filename);

/**
 * Wraps a Babylon scene, for use
 */
abstract class SceneHandle {
  #closed = false;
  constructor(
    private readonly engine: Engine,
    private readonly canvas: HTMLCanvasElement,
    readonly scene = createDefaultScene(engine),
  ) {
    logger(`VoxSceneHandler: created`, this.canvas, this.engine, this.scene);
  }

  createRefAxes(size = 10) {
    const refMesh = createRefAxes(size, this.scene);
  }

  createArcRotateCamera(use = true) {
    const camera = createArcRotateCamera(this.scene);
    if (use) {
      this.scene.setActiveCameraById(camera.id);
      camera.attachControl(false, true, true);
    }
    return camera;
  }

  createDefaultLight() {
    return createDefaultLight(this.scene);
  }

  dispose() {
    if (this.#closed) {
      return;
    }
    this.#closed = true;
    logger(`VoxSceneHandler: dispose()`);
    try {
      this.stopRenderLoop();
      this.scene.cameras.forEach((c) => {
        c.detachControl();
      });
      this.scene.dispose();
    } catch (e) {
      logger(`VoxSceneHandler: dispose() error`);
      logger(e);
    }
  }

  async toggleInspector(enabled: boolean) {
    await Promise.all([import('@babylonjs/core/Debug/debugLayer'), import('@babylonjs/inspector')]);
    if (this.#closed) {
      return;
    }
    if (enabled) {
      await this.scene.debugLayer.show({ globalRoot: this.canvas.parentElement! });
    } else {
      this.scene.debugLayer.hide();
    }
  }

  startRenderLoop() {
    logger('startRenderLoop()');
    startRunLoop(this.engine, this.scene);
  }
  stopRenderLoop() {
    logger('stopRenderLoop()');
    this.engine.stopRenderLoop();
  }
}

class VoxSceneHandle extends SceneHandle {}

export function useVoxScene(engineRef: BabylonEngineRef): PromiseLike<SceneHandle> {
  const value = useDeferred<SceneHandle>();

  useAsyncEffect2(
    async (running, released) => {
      const engine = await Promise.race([released, engineRef.initialized]);
      if (!engine) {
        return;
      }

      const handle = new VoxSceneHandle(engine, engineRef.canvasRef.current!);
      value.fulfill(handle);

      await released;
      handle.dispose();
    },
    [value, engineRef],
    true,
  );

  return value;
}
