import { BabylonContext } from './babylon-context';
import { ParsedVoxFile } from '../../types/vox-types';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';
import { getDefaultPalette } from '../../parser/chunk-reader';
import { buildTriangulatedMesh } from '../../mesh-builder/triangulation';
import { greedyBuild } from '../../mesh-builder/babylonjs/mesh-builder-greedy';
import { buildBabylonMeshProgressive } from '../../mesh-builder/babylonjs/mesh-builder-progressive';

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
  modelIndex: number,
  voxFile: ParsedVoxFile,
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
  ctx: BabylonContext,
  voxFile: ParsedVoxFile,
  modelIndex: number,
  shouldBreak?: () => boolean,
) {
  const model = voxFile.models[modelIndex];
  if (!voxFile.palette) {
    console.warn('no palette found, fallback to use default');
  }
  // new mesh builder
  const mesh = greedyBuild(
    model,
    voxFile.palette ?? getDefaultPalette(),
    `model-${modelIndex}`,
    ctx.scene,
    shouldBreak,
  );

  ctx.camera.setRadius(
    0.5 * Math.min(model.size.x, model.size.y, model.size.z),
    1.5 * Math.max(model.size.x, model.size.y, model.size.z),
  );
}
