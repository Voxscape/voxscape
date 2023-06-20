import { BabylonContext } from './init-babylon';
import { ParsedVoxFile, VoxelModel } from '../../types/vox-types';
import { BabylonMeshBuilder } from '../../babylon/babylon-mesh-builder';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';
import { getDefaultPalette } from '../../parser/chunk-reader';
import { buildTriangulatedMesh } from '../../mesh-builder/triangulation';

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

export async function renderModel(
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
  const started = BabylonMeshBuilder.progessive(
    model,
    voxFile.palette ?? getDefaultPalette(),
    `model-${modelIndex}`,
    ctx.scene,
    ctx.deps,
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
