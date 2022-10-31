import {
  BabylonContext,
  createArcRotateCamera,
  useBabylonContext,
} from '@voxscape/vox.ts/src/demo/babylon/init-babylon';
import React, { useImperativeHandle, useRef } from 'react';

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
    const { SceneLoader } = await import('@babylonjs/core/Loading/sceneLoader');
    const loaded = await SceneLoader.LoadAsync('/', file, this.ctx.engine.instance, () => console.debug('progress'));
    const camera = createArcRotateCamera(loaded, this.canvas);
    camera.attachControl(this.canvas);
    this.ctx.engine.start(loaded);
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
