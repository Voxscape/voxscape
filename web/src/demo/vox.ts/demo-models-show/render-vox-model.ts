import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';
import { getDefaultPalette } from '@voxscape/vox.ts/src/parser/chunk-reader';
import { buildTriangulatedMesh } from '@voxscape/vox.ts/src/mesh-builder/triangulation';
import { buildBabylonMeshProgressive } from '@voxscape/vox.ts/src/mesh-builder/babylonjs/mesh-builder-progressive';
import { ArcRotateCamera, Scene } from '@babylonjs/core';
import * as VoxTypes from '@voxscape/vox.ts/src/types/vox-types';

export async function renderModelAlt(
  scene: Scene,
  camera: ArcRotateCamera,
  voxFile: ParsedVoxFile,
  modelIndex: number,
): Promise<void> {
  if (!voxFile.palette) {
    console.warn('no palette found, fallback to use default');
  }

  const model = voxFile.models[modelIndex];
  const palette = voxFile.palette ?? getDefaultPalette();

  const mesh = await buildTriangulatedMesh(model, palette, scene);

  resetCameraForModel(camera, model);
}

/**
 * @deprecated use {@function renderModel}
 */
export async function renderModelV0(
  camera: ArcRotateCamera,
  scene: Scene,
  voxFile: ParsedVoxFile,
  modelIndex: number,
  shouldBreak?: () => boolean,
): Promise<void> {
  const model = voxFile.models[modelIndex];
  if (!voxFile.palette) {
    console.warn('no palette found, fallback to use default');
  }
  // new mesh builder
  const started = buildBabylonMeshProgressive(
    model,
    voxFile.palette ?? getDefaultPalette(),
    `model-${modelIndex}`,
    scene,
    1000,
  );

  resetCameraForModel(camera, model);

  for await (const progress of started) {
    console.debug('progress', progress);
    await wait(0.01e3); // and do next step
    if (shouldBreak?.()) break;
  }
}

export function resetCameraForModel(camera: ArcRotateCamera, forModel: VoxTypes.VoxelModel) {
  const lower = 0.5 * Math.min(forModel.size.x, forModel.size.y, forModel.size.z);
  const upper = 1.5 * Math.max(forModel.size.x, forModel.size.y, forModel.size.z);
  camera.lowerRadiusLimit = lower;
  camera.upperRadiusLimit = upper;
  camera.radius = (lower + upper) / 2;
}
