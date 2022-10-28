import {
  BabylonContext,
  createArcRotateCamera,
  useBabylonContext,
} from '@voxscape/vox.ts/src/demo/babylon/init-babylon';
import React, { useImperativeHandle, useRef, useSyncExternalStore } from 'react';
import type { Scene } from '@babylonjs/core';
import { Engine, SceneLoader } from '@babylonjs/core';

enum SceneManagerState {
  created = 0,
  busy = 1,
}

export interface SceneBuilder {
  (loader: typeof SceneLoader, engine: Engine): Promise<Scene>;
}

export class SceneManager {
  private inspectorEnabled = false;
  scenes: { scene: Scene; name: string }[] = [];
  private currentScene = 0;
  private state = SceneManagerState.created;

  constructor(private readonly ctx: BabylonContext, private readonly canvas: HTMLCanvasElement) {
    this.scenes.push({ name: 'empty', scene: ctx.scene });
  }

  async toggleInspector(enabled?: boolean): Promise<void> {
    await import('@babylonjs/inspector');
    this.inspectorEnabled = enabled ?? !this.inspectorEnabled;
    if (this.inspectorEnabled) {
      this.scenes[this.currentScene].scene._debugLayer.show();
    } else {
      this.scenes.forEach(({ scene }) => scene.debugLayer.hide());
    }
  }

  async addScene(name: string, builder: SceneBuilder): Promise<number> {
    if (this.state !== SceneManagerState.created) {
      throw new Error(`busy`);
    }
    try {
      const { SceneLoader } = await import('@babylonjs/core/Loading/sceneLoader');
      this.state = SceneManagerState.busy;
      const created = await builder(SceneLoader, this.ctx.engine.instance);
      this.scenes.push({ name, scene: created });
      return this.scenes.length - 1;
    } finally {
      this.state = SceneManagerState.created;
    }
  }

  async switchScene(sceneIndex: number) {
    if (this.state === SceneManagerState.created && sceneIndex !== this.currentScene) {
      const newScene = this.scenes[sceneIndex].scene;

      this.toggleInspector(false);
      this.scenes[this.currentScene].scene.cameras.forEach((c) => c.detachControl());

      this.ctx.engine.start(newScene);
    }
  }
}

interface Prop {
  canvasProps: React.HTMLProps<HTMLCanvasElement>;
}

const _BabylonGltfRenderer = (props: Prop, ref: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const babylonCtx = useBabylonContext(canvasRef);
  useImperativeHandle(ref, () => babylonCtx && new SceneManager(babylonCtx, canvasRef.current!), [babylonCtx]);
  return <canvas {...props.canvasProps} ref={canvasRef} />;
};

export const BabylonSceneView = React.forwardRef<SceneManager, Prop>(_BabylonGltfRenderer);
