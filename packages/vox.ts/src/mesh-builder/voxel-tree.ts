import { off } from 'process';
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
  #voxels: readonly Voxel[];
  readonly leftChild?: VoxelTree;
  readonly rightChild?: VoxelTree;

  constructor(
    voxels: Voxel[],
    readonly threshold: number,
    readonly axis: Axis,
    readonly depth: number,
    readonly offset: number,
    readonly size: number,
  ) {
    const sortedVoxels = voxels.slice(offset, offset + size).sort((v1, v2) => v1[axis] - v2[axis]);
    for (let i = 0; i < size; i++) {
      // must not use splice() here. splice() will stack overflow with large `size`
      voxels[offset + i] = sortedVoxels[i];
    }

    this.#voxels = voxels;

    if (threshold > MIN_THRESHOLD) {
      const nextAxis = nextAxisLoop[axis];
      const nextThreshold = nextAxis === 'x' ? threshold / 2 : threshold;

      const leftSize = sortedVoxels.filter((v) => v[axis] < threshold).length;
      const rightSize = size - leftSize;

      if (leftSize) {
        this.leftChild = new VoxelTree(voxels, nextThreshold, nextAxis, 1 + depth, offset, leftSize);
      }
      if (rightSize) {
        this.rightChild = new VoxelTree(voxels, nextThreshold, nextAxis, 1 + depth, offset + leftSize, rightSize);
      }
    }
  }

  get voxels(): readonly Voxel[] {
    return this.#voxels.slice(this.offset, this.offset + this.size)
  }
  get isLeaf(): boolean {
    return !this.leftChild && !this.rightChild
  }
}

export function buildVoxelTree(voxelModel: VoxelModel): VoxelTree {
  const maxDimension = Math.max(voxelModel.size.x, voxelModel.size.y, voxelModel.size.z);
  const nextPower2 = Math.floor(Math.log2(maxDimension));

  const initialThreshold = 2 ** (nextPower2 - 1);

  return new VoxelTree(voxelModel.voxels.slice(), initialThreshold, 'x', 0, 0, voxelModel.voxels.length);
}
