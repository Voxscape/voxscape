import React, { useRef, useState } from 'react';
import { ParsedVoxFile } from '../../types/vox-types';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import clsx from 'clsx';
import { useBabylonContext, useBabylonInspector } from '../../babylon-react/babylon-context';
import { createRefAxes } from '../../babylon/create-ref-axes';
import { renderModel } from './render-vox-model';

export const BabylonModelRenderer: React.FC<{
  onReset?(): void;
  modelFile?: ParsedVoxFile;
  modelIndex?: number;
  builder?: string;
}> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const babylonCtx = useBabylonContext(canvasRef);
  const modelFile = props.modelFile;
  const modelIndex = props.modelIndex;

  useAsyncEffect(
    async (mounted, effectReleased) => {
      if (!babylonCtx) {
        return;
      }

      const refMesh = createRefAxes(10, babylonCtx.scene);

      if (typeof modelIndex === 'number' && modelFile?.models[modelIndex]) {
        // renderModel(babylonCtx, modelIndex, modelFile, () => !mounted.current);
        await renderModel(babylonCtx.scene, babylonCtx.camera.instance, modelFile, modelIndex, () => !mounted.current);
      } else {
        console.warn('no model to render, rendering playground');
      }

      babylonCtx.engine.start();
      effectReleased.then(() => {
        refMesh.dispose();
        babylonCtx.engine.stop();
      });
    },
    [babylonCtx, modelFile, modelIndex],
  );

  const [enableInspector, setEnableInspector] = useState(false);
  useBabylonInspector(babylonCtx, enableInspector);

  return (
    <div className={clsx('py-24')}>
      <canvas ref={canvasRef} className={clsx('bg-white mx-auto')} style={{ width: 640, height: 480 }} />
      <hr />
      <p className="p-2 space-x-2">
        <button type="button" className="p-2" onClick={() => setEnableInspector(!enableInspector)}>
          {enableInspector ? 'disable inspector' : 'enable inspector'}
        </button>
        <button type="button" onClick={props.onReset}>
          reset
        </button>
      </p>
    </div>
  );
};
