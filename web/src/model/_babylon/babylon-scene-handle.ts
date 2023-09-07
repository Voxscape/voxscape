import { Engine, Scene } from '@babylonjs/core';
import { createDebugLogger } from '../../../shared/logger';
import {
  createDefaultLight,
  createArcRotateCamera,
  startRunLoop,
  createDefaultScene,
} from '@voxscape/vox.ts/src/babylon/factory';
import { createRefAxes } from '@voxscape/vox.ts/src/babylon/create-ref-axes';

const logger = createDebugLogger(__filename);

/**
 * Wraps a Babylon scene, for more generic use
 */
export abstract class BabylonSceneHandle {
  #disposed = false;

  constructor(
    private readonly engine: Engine,
    private readonly canvas: HTMLCanvasElement,
    protected readonly scene: Scene = createDefaultScene(engine),
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
    if (this.#disposed) {
      return;
    }
    this.#disposed = true;
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

  async toggleInspector(enabled: boolean, inspectorRoot?: HTMLElement) {
    await Promise.all([import('@babylonjs/core/Debug/debugLayer'), import('@babylonjs/inspector')]);
    if (this.#disposed) {
      return;
    }
    if (enabled) {
      await this.scene.debugLayer.show({
        globalRoot: inspectorRoot ?? this.canvas.parentElement!,
      });
    } else {
      this.scene.debugLayer.hide();
    }
  }

  onCanvasResize() {
    logger('onCanvasResize()');
    this.engine.resize();
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
