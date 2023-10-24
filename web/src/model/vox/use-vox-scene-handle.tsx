import { RefObject, useEffect, useRef } from 'react';
import type * as VoxTypes from '@voxscape/vox.ts/src/types/vox-types';

import { resetCameraForModel } from '@voxscape/vox.ts/src/babylon/utils';
import { VoxSceneHandle } from './vox-scene-handle';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { Engine, Mesh, Scene } from '@babylonjs/core';
import { useSyncResource } from '../../hooks/use-sync-resource';
import { getDefaultPalette } from '@voxscape/vox.ts/src/parser/chunk-reader';
import { createDebugLogger } from '../../../shared/logger';

const logger = createDebugLogger(__filename);

export function useRenderAccessories(
  target: ViewerTarget,
  config: ViewerConfig,
  sceneHandle: null | VoxSceneHandle,
): void {
  const enableLight = config.enableLight ?? true;
  useEffect(() => {
    if (!(enableLight && sceneHandle)) {
      return;
    }

    const light = sceneHandle.createDefaultLight();
    return () => light.dispose();
  }, [enableLight, sceneHandle]);

  const showAxes = config.showAxes ?? true;
  useEffect(() => {
    if (!(showAxes && sceneHandle)) {
      return;
    }
    const model = target.file.models[target.modelIndex];
    const axes = sceneHandle.createModelRefAxes(model);
    return () => axes.dispose();
  }, [showAxes, sceneHandle]);
}

export function useRenderVox(target: ViewerTarget, sceneHandle: null | VoxSceneHandle): void {
  useAsyncEffect(
    async (running, released) => {
      if (!sceneHandle) {
        return;
      }
      const model = target.file.models[target.modelIndex];
      const palette = target.file.palette ?? getDefaultPalette();
      const loadModelEffect = sceneHandle.loadModel(model, palette);
      released.then(() => loadModelEffect.abortController.abort(new Error(`useRenderVox(): released`)));

      const modelLoaded = await Promise.race([loadModelEffect.loaded, released]);
      logger('modelLoaded', modelLoaded, sceneHandle);
      if (modelLoaded?.mesh) {
        // sceneHandle.addMesh(modelLoaded.mesh);
        resetCameraForModel(sceneHandle.defaultCamera, model);
        sceneHandle.startRenderLoop();

        await released;
        sceneHandle.stopRenderLoop();
      }
    },
    [sceneHandle],
    true,
  );
}

export function useVoxSceneHandle(canvas: HTMLCanvasElement, engine: Engine): null | VoxSceneHandle {
  return useSyncResource(
    () => new VoxSceneHandle(engine, canvas),
    (handle) => handle.dispose(),
  );
}

export interface ViewerTarget {
  file: VoxTypes.ParsedVoxFile;
  modelIndex: number;
}

export interface ViewerConfig {
  enableLight?: boolean;
  showAxes?: boolean;
  enableInspector?: boolean;
}
