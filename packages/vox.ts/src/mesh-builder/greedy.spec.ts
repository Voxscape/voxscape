import { findVoxelSegment } from './greedy';
import * as VoxTypes from '../types/vox-types';

/**
 * FIXME: jest fails to run
 */
describe(findVoxelSegment, () => {
  it('find consecutive along x axis - same color', () => {
    const xs = [
      // index=0
      0,
      // index=1
      2, 3,
      // index=3
      5, 6, 7, 8, 9,
      // index=8
      12, 13,
      // index=10
      15,
    ];
    const voxels: VoxTypes.Voxel[] = xs.map((x) => ({ x, y: 0, z: 0, colorIndex: 1 }));

    expect(findVoxelSegment(voxels, 'x', 0)).toEqual(1);
    expect(findVoxelSegment(voxels, 'x', 1)).toEqual(2);
    expect(findVoxelSegment(voxels, 'x', 2)).toEqual(1);
    expect(findVoxelSegment(voxels, 'x', 3)).toEqual(5);
    expect(findVoxelSegment(voxels, 'x', 7)).toEqual(1);
    expect(findVoxelSegment(voxels, 'x', 8)).toEqual(2);
    expect(findVoxelSegment(voxels, 'x', 10)).toEqual(1);
  });
});
