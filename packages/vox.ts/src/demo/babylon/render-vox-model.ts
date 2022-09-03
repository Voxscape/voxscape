import { BabylonContext } from './init-babylon';
import { ParsedVoxFile, VoxelModel } from '../../types/vox-types';
import { BabylonMeshBuilder } from '../../babylon/babylon-mesh-builder';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';

export async function renderModel(
  ctx: BabylonContext,
  voxModel: VoxelModel,
  voxFile: ParsedVoxFile,
  shouldBreak?: () => boolean,
) {
  const firstModel = voxModel;
  // new mesh builder
  const started = BabylonMeshBuilder.progessive(voxModel, voxFile.palette, 'first-model', ctx.scene, ctx.deps, 100);

  ctx.camera.setRadius(Math.max(2 * firstModel.size.x, 2 * firstModel.size.y, 2 * firstModel.size.z));

  for (const p of started) {
    await wait(0.02e3); // and do next step
    if (shouldBreak?.()) break;
  }
}
