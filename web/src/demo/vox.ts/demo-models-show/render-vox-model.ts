import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';
import { getDefaultPalette } from '@voxscape/vox.ts/src/parser/chunk-reader';
import { buildTriangulatedMesh } from '@voxscape/vox.ts/src/mesh-builder/triangulation';
import { greedyBuild } from '@voxscape/vox.ts/src/mesh-builder/babylonjs/mesh-builder-greedy';
import { buildBabylonMeshProgressive } from '@voxscape/vox.ts/src/mesh-builder/babylonjs/mesh-builder-progressive';
import { ArcRotateCamera, Scene } from '@babylonjs/core';
import * as VoxTypes from '@voxscape/vox.ts/src/types/vox-types';
import { BabylonContext } from '@voxscape/vox.ts/src/babylon-react/babylon-context';

export async function renderModelAlt(ctx: BabylonContext, voxFile: ParsedVoxFile, modelIndex: number): Promise<void> {
  if (!voxFile.palette) {
    console.warn('no palette found, fallback to use default');
  }

  const model = voxFile.models[modelIndex];
  const palette = voxFile.palette ?? getDefaultPalette();

  const mesh = await buildTriangulatedMesh(model, palette, ctx.scene);

  ctx.camera.setRadius(
    0.5 * Math.min(model.size.x, model.size.y, model.size.z),
    1.5 * Math.max(model.size.x, model.size.y, model.size.z),
  );
}

/**
 * @deprecated use {@function renderModel}
 */
export async function renderModelV0(
  ctx: BabylonContext,
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
    ctx.scene,
    1000,
  );

  ctx.camera.setRadius(
    0.5 * Math.min(model.size.x, model.size.y, model.size.z),
    1.5 * Math.max(model.size.x, model.size.y, model.size.z),
  );

  for await (const progress of started) {
    console.debug('progress', progress);
    await wait(0.01e3); // and do next step
    if (shouldBreak?.()) break;
  }
}

export async function renderModel(
  scene: Scene,
  camera: ArcRotateCamera,
  voxFile: ParsedVoxFile,
  modelIndex: number,
  shouldStop?: () => boolean,
) {
  const model = voxFile.models[modelIndex];
  if (!voxFile.palette) {
    console.warn('no palette found, fallback to use default');
  }
  // new mesh builder
  const mesh = greedyBuild(model, voxFile.palette ?? getDefaultPalette(), `model-${modelIndex}`, scene, {
    shouldStop,
  });

  resetCameraForModel(camera, model);
}

export function resetCameraForModel(camera: ArcRotateCamera, forModel: VoxTypes.VoxelModel) {
  const lower = 0.5 * Math.min(forModel.size.x, forModel.size.y, forModel.size.z);
  const upper = 1.5 * Math.max(forModel.size.x, forModel.size.y, forModel.size.z);
  camera.lowerRadiusLimit = lower;
  camera.upperRadiusLimit = upper;
  camera.radius = (lower + upper) / 2;
}
