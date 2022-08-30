import * as VoxTypes from '../types/vox-types';
import { DefaultMap } from '../util/default-map';

export function createVoxelIndex(
  voxels: readonly VoxTypes.Voxel[],
): ReadonlyMap<number, ReadonlyMap<number, ReadonlyMap<number, VoxTypes.Voxel>>> {
  // vox: x-right / y-'deep' / z-top or 'gravity'
  // babylon: x-right / z-'deep' / y-top
  // we use x => y => z => voxel here
  const index = new DefaultMap<
    number, // x
    DefaultMap<
      number, // y
      Map<
        number, // z
        VoxTypes.Voxel
      >
    >
  >((x) => new DefaultMap<number, Map<number, VoxTypes.Voxel>>((y) => new Map()));
  for (const v of voxels) {
    index.getOrCreate(v.x).getOrCreate(v.y).set(v.z, v);
  }

  return index;
}
