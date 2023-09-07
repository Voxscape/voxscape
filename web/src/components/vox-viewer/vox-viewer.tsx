import { RefObject } from 'react';
import { useVoxScene } from './use-vox-scene';
import type * as VoxTypes from '@voxscape/vox.ts/src/types/vox-types';
import type { Scene } from '@babylonjs/core';
import { getDefaultPalette } from '@voxscape/vox.ts/src/parser/chunk-reader';
import { greedyBuild } from '@voxscape/vox.ts/src/mesh-builder/babylonjs/mesh-builder-greedy';
import { useBabylonEngine } from './use-babylon-engine';
import { useAsyncEffect2 } from '../../hooks/use-async-effect2';

import { resetCameraForModel } from '@voxscape/vox.ts/src/babylon/utils';

export function useVoxViewer(canvasRef: RefObject<HTMLCanvasElement>, target: ViewerTarget) {
  const engine = useBabylonEngine(canvasRef);
  const _scene = useVoxScene(engine);

  useAsyncEffect2(
    async (running, released) => {
      const scene = await _scene;

      if (!(target && running.current && canvasRef.current)) {
        return;
      }

      const model = target.file.models[target.modelIndex];
      scene.createRefAxes(1.2 * Math.max(model.size.x, model.size.y, model.size.z));
      scene.createDefaultLight();

      const camera = scene.createArcRotateCamera();
      resetCameraForModel(camera, model);

      const mesh = await loadModel(scene.scene, target, () => !running.current);

      scene.startRenderLoop();

      await released;
      mesh.dispose(undefined, true);
    },

    [_scene, target.file, target.modelIndex],
    true,
  );

  return _scene;
}

interface ViewerTarget {
  file: VoxTypes.ParsedVoxFile;
  modelIndex: number;
}

async function loadModel(scene: Scene, { file, modelIndex }: ViewerTarget, shouldStop: () => boolean) {
  if (!file.palette) {
    console.warn('no palette found, fallback to use default');
  }
  const model = file.models[modelIndex];

  // new mesh builder
  const mesh = greedyBuild(model, file.palette ?? getDefaultPalette(), `model-${modelIndex}`, scene, {
    shouldStop,
  });
  return mesh;
}
