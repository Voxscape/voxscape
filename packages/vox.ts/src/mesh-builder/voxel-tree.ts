import { ParsedVoxFile, VoxelModel, Voxel, VoxelGroup } from '../types/vox-types';

type Axis = 'x' | 'y' | 'z';

const nextAxisLoop = {
  x: 'y',
  y: 'z',
  z: 'x',
} as const;

const MIN_THRESHOLD = 8; // making voxelTree.voxels.length < 8*8*8 voxels

// 3-kdtree
class VoxelTree {
  readonly voxels?: readonly Voxel[];
  readonly left?: VoxelTree;
  readonly right?: VoxelTree;

  constructor(
    voxels: readonly Voxel[],
    readonly threshold: number,
    readonly axis: Axis,
    readonly depth: number,
  ) {
    if (threshold > MIN_THRESHOLD) {
      const nextAxis = nextAxisLoop[axis];
      const nextThreshold = nextAxis === 'x' ? threshold / 2 : threshold;

      const [leftVoxels, rightVoxels] = splitVoxels(voxels, threshold, axis);

      if (leftVoxels.length) {
        this.left = new VoxelTree(leftVoxels, nextThreshold, nextAxis, 1 + depth);
      }
      if (rightVoxels.length) {
        this.right = new VoxelTree(rightVoxels, nextThreshold, nextAxis, 1 + depth);
      }
    } else {
      this.voxels = voxels
    }
  }
}

export function buildVoxelTree(voxelModel: VoxelModel): VoxelTree {
  const maxDimension = Math.max(voxelModel.size.x, voxelModel.size.y, voxelModel.size.z);
  const nextPower2 = Math.floor(Math.log2(maxDimension));

  const initialThreshold = 2 ** (nextPower2 - 1);

  return new VoxelTree(voxelModel.voxels, initialThreshold, 'x', 0);
}

function splitVoxels(voxels: readonly Voxel[], threshold: number, axis: 'x' | 'y' | 'z'): [Voxel[], Voxel[]] {
  const p1: Voxel[] = [];
  const p2: Voxel[] = [];
  voxels.forEach((v) => {
    if (v[axis] < threshold) {
      p1.push(v);
    } else {
      p2.push(v);
    }
  });
  return [p1, p2];
}
