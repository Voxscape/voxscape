import { RefObject } from 'react';
import { useVoxScene } from './use-vox-scene';
import type * as VoxTypes from '@voxscape/vox.ts/src/types/vox-types';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { Scene } from '@babylonjs/core';
import { getDefaultPalette } from '@voxscape/vox.ts/src/parser/chunk-reader';
import { greedyBuild } from '@voxscape/vox.ts/src/mesh-builder/babylonjs/mesh-builder-greedy';
import { useBabylonEngine } from './use-babylon-engine';

export function useVoxViewer(canvasRef: RefObject<HTMLCanvasElement>, target: ViewerTarget) {
  const engine = useBabylonEngine(canvasRef);
  const _scene = useVoxScene(engine);

  useAsyncEffect(
    async (running, released) => {
      const scene = await _scene;

      if (!(target && running.current && canvasRef.current)) {
        return;
      }

      const model = target.file.models[target.modelIndex];

      const camera = scene.createArcRotateCamera();

      scene.setCameraRadius(
        camera,
        0.5 * Math.min(model.size.x, model.size.y, model.size.z),
        1.5 * Math.max(model.size.x, model.size.y, model.size.z),
      );

      const mesh = await loadModel(scene.scene, target, () => running.current!);
      await released;
      mesh.dispose(undefined, true);
    },

    [_scene, target.file, target.modelIndex],
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
