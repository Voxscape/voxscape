import {
  BabylonContext,
  createArcRotateCamera,
  useBabylonContext,
} from '@voxscape/vox.ts/src/demo/babylon/init-babylon';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import React, { useImperativeHandle, useRef } from 'react';
import type { PropOf } from '@jokester/ts-commonutil/lib/react/util/prop-of';
import type { Scene } from '@babylonjs/core';

export class BabylonGltfRendererHandle {
  private inspectorEnabled = false;
  private inspectorLoaded = import('@babylonjs/inspector');
  private scene: null | Scene = null;
  constructor(private readonly ctx: BabylonContext, private readonly canvas: HTMLCanvasElement) {}

  async toggleInspector(enabled?: boolean): Promise<void> {
    this.inspectorEnabled = enabled ?? !this.inspectorEnabled;
    await this.inspectorLoaded;
    if (this.inspectorEnabled) {
      this.scene?._debugLayer?.show();
    } else {
      this.scene?.debugLayer.hide();
    }
  }

  async loadModel(file: File): Promise<void> {
    console.debug(__filename, 'loadModel', file);
    const { SceneLoader } = await import('@babylonjs/core/Loading/sceneLoader');
    const scene = await SceneLoader.LoadAsync('/blender', file, this.ctx.engine.instance, (ev) =>
      console.debug('progress', ev),
    );
    console.debug(__filename, 'loaded', scene);
    this.ctx.engine.start((this.scene = scene));
    const camera = scene.cameras[0];
    // const camera = createArcRotateCamera(scene, this.canvas);
    camera.attachControl(this.canvas);
    scene.setActiveCameraById(camera.id);
  }
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
