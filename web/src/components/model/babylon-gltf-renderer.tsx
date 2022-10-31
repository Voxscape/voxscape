import {
  BabylonContext,
  createArcRotateCamera,
  useBabylonContext,
} from '@voxscape/vox.ts/src/demo/babylon/init-babylon';
import React, { useImperativeHandle, useRef } from 'react';
import type { Engine, Scene } from '@babylonjs/core';

export class BabylonGltfRendererHandle {
  private inspectorEnabled = false;
  private inspectorLoaded = import('@babylonjs/inspector');
  constructor(private readonly ctx: BabylonContext, private readonly canvas: HTMLCanvasElement) {}

  async toggleInspector(enabled?: boolean) {
    this.inspectorEnabled = enabled ?? !this.inspectorEnabled;
    await this.inspectorLoaded;
    if (this.inspectorEnabled) {
      this.ctx.scene.debugLayer.show();
    } else {
      this.ctx.scene.debugLayer.hide();
    }
  }

  async loadModel(file: File) {
    console.debug(__filename, 'loadModel', file);
    const loaded = await workingLoadModel(file, this.ctx.engine.instance);
    const camera = createArcRotateCamera(loaded, this.canvas);
    camera.attachControl(this.canvas);
    this.ctx.engine.start(loaded);
  }
}

export async function workingLoadModel2(file: File | string, engine: Engine): Promise<Scene> {
  const core = await import('@babylonjs/core');
  // await import('@babylonjs/inspector');
  await import('@babylonjs/materials');
  await import('@babylonjs/loaders');
  await import('@babylonjs/loaders/glTF');

  const loaded = await core.SceneLoader.LoadAsync('/blender/', 'shirt-split3.gltf', engine, (ev) =>
    console.debug('progress', ev),
  );
  return loaded;
}

export async function workingLoadModel(file: File, engine: Engine): Promise<Scene> {
  const core = await import('@babylonjs/core');
  // await import('@babylonjs/inspector');
  await import('@babylonjs/materials');
  await import('@babylonjs/loaders');
  await import('@babylonjs/loaders/glTF');
  const { SceneLoader } = await import('@babylonjs/core/Loading/sceneLoader');
  const loaded = await SceneLoader.LoadAsync('/', file, engine, () => console.debug('progress'));
  return loaded;
}

interface Prop {
  canvasProps: React.HTMLProps<HTMLCanvasElement>;
}

const _BabylonGltfRenderer = (props: Prop, ref: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const babylonCtx = useBabylonContext(canvasRef);
  useImperativeHandle(ref, () => babylonCtx && new BabylonGltfRendererHandle(babylonCtx, canvasRef.current!), [
    babylonCtx,
  ]);
  return <canvas {...props.canvasProps} ref={canvasRef} />;
};

export const BabylonGltfRenderer = React.forwardRef<BabylonGltfRendererHandle, Prop>(_BabylonGltfRenderer);
