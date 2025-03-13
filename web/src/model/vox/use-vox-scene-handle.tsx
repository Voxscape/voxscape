import { useEffect, useState } from 'react';
import type * as VoxTypes from '@voxscape/vox.ts/src/types/vox-types';

import { resetCameraForModel } from '@voxscape/vox.ts/src/babylon/utils';
import { VoxSceneHandle } from './vox-scene-handle';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { DirectionalLight, Engine, HemisphericLight, Mesh, Scene, ShadowGenerator } from '@babylonjs/core';
import { useSyncResource } from '../../hooks/use-sync-resource';
import { getDefaultPalette } from '@voxscape/vox.ts/src/parser/chunk-reader';
import { createDebugLogger } from '../../../shared/logger';

const logger = createDebugLogger(__filename);

interface LightGroup {
  ambient: HemisphericLight;
  l1: DirectionalLight;
  l1Shadow: ShadowGenerator;
  l2: DirectionalLight;
}

function useRenderLight(
  sceneHandle: null | VoxSceneHandle,
  target: ViewerTarget,
  config: ViewerConfig,
): null | LightGroup {
  const [lights, setLights] = useState<null | LightGroup>(null);
  const enableLight = config.enableLight ?? true;

  useAsyncEffect(
    async (running, released) => {
      if (!sceneHandle) {
        return;
      }

      const defaultLight = sceneHandle.createDefaultLight();
      // defaultLight.setEnabled(false)
      const light = sceneHandle.createTopLight();
      light.l1.setEnabled(false);
      light.l2.setEnabled(false);
      const shadowGenerator = new ShadowGenerator(1024, light.l1);
      setLights({
        ambient: defaultLight,
        ...light,
        l1Shadow: shadowGenerator,
      });

      await released;
      defaultLight.dispose();
      shadowGenerator.dispose();
      light.l1.dispose();
      light.l2.dispose();
    },
    [sceneHandle],
  );

  useEffect(() => {
    if (!lights) {
      return;
    }
    lights.l1.setEnabled(enableLight);
    lights.l2.setEnabled(enableLight);
  }, [lights, enableLight]);

  return lights;
}

export function useRefAxis(target: ViewerTarget, config: ViewerConfig, sceneHandle: null | VoxSceneHandle): void {
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

export function useRenderVox(
  target: ViewerTarget,
  viewerConfig: ViewerConfig,
  sceneHandle: null | VoxSceneHandle,
): void {
  const lights = useRenderLight(sceneHandle, target, viewerConfig);
  const [mesh, setMesh] = useState<null | Mesh>(null);
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
        setMesh(modelLoaded.mesh);
        resetCameraForModel(sceneHandle.defaultCamera, model);
        sceneHandle.startRenderLoop();

        await released;
        sceneHandle.stopRenderLoop();
      }
    },
    [sceneHandle],
  );

  useEffect(() => {
    const shadowMap = lights?.l1Shadow.getShadowMap();
    if (!(mesh && lights && shadowMap?.renderList)) {
      return;
    }
    shadowMap.renderList!.push(mesh);
    return () => {
      const f = shadowMap.renderList!.indexOf(mesh);
      if (f >= 0) {
        lights.l1Shadow.getShadowMap()!.renderList!.splice(f, 1);
      }
    };
  }, [mesh, lights]);
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
