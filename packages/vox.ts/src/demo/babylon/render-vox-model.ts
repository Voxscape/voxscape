import { BabylonContext } from './init-babylon';
import { ParsedVoxFile, VoxelModel } from '../../types/vox-types';
import { BabylonMeshBuilder } from '../../babylon/babylon-mesh-builder';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';

export async function renderModel(
  ctx: BabylonContext,
  voxModel: VoxelModel,
  voxFile: ParsedVoxFile,
  shouldBreak?: () => boolean,
): Promise<void> {
  const firstModel = voxModel;
  // new mesh builder
  const started = BabylonMeshBuilder.progessive(voxModel, voxFile.palette, 'first-model', ctx.scene, ctx.deps, 1000);

  ctx.camera.setRadius(
    0.2 * Math.min(firstModel.size.x, firstModel.size.y, firstModel.size.z),
    1.5 * Math.max(firstModel.size.x, firstModel.size.y, firstModel.size.z),
  );

  for await (const progress of started) {
    console.debug('progress', progress);
    await wait(0.01e3); // and do next step
    if (shouldBreak?.()) break;
  }
}
