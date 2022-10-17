import type { BabylonDeps } from '@voxscape/vox.ts/src/babylon/babylon-deps';

import { BabylonContext, useBabylonContext } from '@voxscape/vox.ts/src/demo/babylon/init-babylon';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import React, { useImperativeHandle, useRef } from 'react';
import { PropOf } from '@jokester/ts-commonutil/lib/react/util/prop-of';

export class BabylonGltfRendererHandle {
  private inspectorEnabled = false;
  private inspectorLoaded = import('@babylonjs/inspector');
  constructor(public readonly ctx: BabylonContext) {}

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
  }
}

interface Prop {
  canvasProps: React.HTMLProps<HTMLCanvasElement>;
}

const _BabylonGltfRenderer = (props: Prop, ref: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const babylonCtx = useBabylonContext(canvasRef);
  useImperativeHandle(ref, () => babylonCtx && new BabylonGltfRendererHandle(babylonCtx), [babylonCtx]);

  return <canvas {...props.canvasProps} ref={canvasRef} />;
};

export const BabylonGltfRenderer = React.forwardRef<BabylonGltfRendererHandle, Prop>(_BabylonGltfRenderer);
