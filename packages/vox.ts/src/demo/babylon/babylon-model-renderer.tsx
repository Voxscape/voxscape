import React, { useRef, useState } from 'react';
import { ParsedVoxFile } from '../../types/vox-types';
import { useBabylonContext, useBabylonInspector } from './init-babylon';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { createRefAxes } from './deps/create-ref-axes';
import { renderModel } from './render-vox-model';
import { renderPlayground } from './render-playground';
import classNames from 'classnames';

export const BabylonModelRenderer: React.FC<{ onReset?(): void; modelFile?: ParsedVoxFile; modelIndex?: number }> = (
  props,
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const babylonCtx = useBabylonContext(canvasRef);
  const modelFile = props.modelFile;
  const model = modelFile?.models[props.modelIndex ?? 0];

  useAsyncEffect(
    async (mounted, effectReleased) => {
      if (!babylonCtx) {
        return;
      }

      // fixme: should re-init scene when model changes
      createRefAxes(100, babylonCtx.scene, babylonCtx.deps);
      babylonCtx.engine.start();

      if (modelFile && model) {
        renderModel(babylonCtx, model, modelFile, () => !mounted.current);
      } else {
        babylonCtx.camera.setRadius(50);
        renderPlayground(babylonCtx);
      }

      effectReleased.then(() => {
        babylonCtx.engine.stop();
      });
    },
    [babylonCtx, modelFile, model],
  );

  const [enableInspector, setEnableInspector] = useState(false);
  useBabylonInspector(babylonCtx, enableInspector);

  return (
    <div className={classNames('py-24')}>
      <canvas ref={canvasRef} className={classNames('bg-white mx-auto')} style={{ width: 640, height: 480 }} />
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
