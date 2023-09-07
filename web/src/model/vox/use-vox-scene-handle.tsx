import { RefObject, useEffect, useRef } from 'react';
import type * as VoxTypes from '@voxscape/vox.ts/src/types/vox-types';
import { useBabylonEngine } from '../_babylon/use-babylon-engine';
import { useAsyncEffect2 } from '../../hooks/use-async-effect2';

import { resetCameraForModel } from '@voxscape/vox.ts/src/babylon/utils';
import { useWindowSize } from 'react-use';
import { VoxSceneHandle } from './vox-scene-handle';

export function useVoxSceneHandle(
  canvasRef: RefObject<HTMLCanvasElement>,
  target: ViewerTarget,
): RefObject<undefined | VoxSceneHandle> {
  const _engine = useBabylonEngine(canvasRef);
  const windowSize = useWindowSize();
  const handle = useRef<VoxSceneHandle>();

  useAsyncEffect2(
    async (running, released) => {
      const engine = await Promise.race([released, _engine.initialized]);
      if (!(running.current && engine && !handle.current)) {
        return;
      }

      const scene = (handle.current = new VoxSceneHandle(engine, canvasRef.current!));

      scene.createDefaultLight();

      const model = target.file.models[target.modelIndex];
      scene.createModelRefAxes(model);

      const camera = scene.createArcRotateCamera();
      resetCameraForModel(camera, model);

      const mesh = await scene.loadModel(target.file, target.modelIndex, {
        shouldStop: () => !running.current,
      });

      scene.startRenderLoop();

      await released;
      scene.toggleInspector(false);
      scene.dispose();
      handle.current = undefined;
    },

    [_engine, target.file, target.modelIndex],
    true,
  );

  useEffect(() => {
    handle.current?.onCanvasResize();
  }, [windowSize.width, windowSize.height]);
  return handle;
}

interface ViewerTarget {
  file: VoxTypes.ParsedVoxFile;
  modelIndex: number;
}
