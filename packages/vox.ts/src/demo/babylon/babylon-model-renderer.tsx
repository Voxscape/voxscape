import React, { useRef, useState } from 'react';
import { ParsedVoxFile } from '../../types/vox-types';
import { useBabylonContext, useBabylonInspector } from './init-babylon';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { createRefAxes } from './deps/create-ref-axes';
import { renderModel, renderModel3, renderModelAlt } from './render-vox-model';
import clsx from 'clsx';

export const BabylonModelRenderer: React.FC<{ onReset?(): void; modelFile?: ParsedVoxFile; modelIndex?: number }> = (
  props,
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const babylonCtx = useBabylonContext(canvasRef);
  const modelFile = props.modelFile;
  const modelIndex = props.modelIndex;

  useAsyncEffect(
    async (mounted, effectReleased) => {
      if (!babylonCtx) {
        return;
      }

      createRefAxes(10, babylonCtx.scene);

      if (typeof modelIndex === 'number' && modelFile?.models[modelIndex]) {
        // renderModel(babylonCtx, modelIndex, modelFile, () => !mounted.current);
        renderModel3(babylonCtx, modelFile, modelIndex, () => !mounted.current);
      } else {
        console.warn('no model to render, rendering playground');
      }

      babylonCtx.engine.start();
      effectReleased.then(() => {
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
