import { ParsedVoxFile, VoxelModel, Voxel, VoxelGroup } from '../types/vox-types';

type Axis = 'x' | 'y' | 'z';

const nextAxisLoop = {
  x: 'y',
  y: 'z',
  z: 'x',
} as const;

const MIN_SPAN_LENGTH = 8 ** 3; // stop splitting when span length (#voxels) is less than this

/**
 * a 3D region in space,
 * a node in octree,
 * and a slice in Voxel[] array.
 */
interface VoxelSpan {
  offset: number; // within voxels[]
  length: number; // within voxels[]
  xMin: number; // inclusive
  xMax: number; // exclusive
  yMin: number; // inclusive
  yMax: number; // exclusive
  zMin: number; // inclusive
  zMax: number; // exclusive
}

function splitSpan(voxels: Voxel[], parent: VoxelSpan, axis: Axis): [VoxelSpan, VoxelSpan] {
  // sort voxels in "parent" in-place by axis
  const sortedVoxels = voxels.slice(parent.offset, parent.offset + parent.length).sort((v1, v2) => v1[axis] - v2[axis]);
  for (let i = 0; i < parent.length; i++) {
    // must not use splice() here. splice() will stack overflow with large `size`
    voxels[parent.offset + i] = sortedVoxels[i];
  }

  if (axis === 'x') {
    const xMid = (parent.xMin + parent.xMax) >> 1;
    const leftLength = sortedVoxels.filter((v) => v.x < xMid).length;
    return [
      {
        offset: parent.offset,
        length: leftLength,
        xMin: parent.xMin,
        xMax: xMid,
        yMin: parent.yMin,
        yMax: parent.yMax,
        zMin: parent.zMin,
        zMax: parent.zMax,
      },
      {
        offset: parent.offset + leftLength,
        length: parent.length - leftLength,
        xMin: xMid,
        xMax: parent.xMax,
        yMin: parent.yMin,
        yMax: parent.yMax,
        zMin: parent.zMin,
        zMax: parent.zMax,
      },
    ];
  } else if (axis === 'y') {
    const yMid = (parent.yMin + parent.yMax) >> 1;
    const leftLength = sortedVoxels.filter((v) => v.y < yMid).length;
    return [
      {
        offset: parent.offset,
        length: leftLength,
        xMin: parent.xMin,
        xMax: parent.xMax,
        yMin: parent.yMin,
        yMax: yMid,
        zMin: parent.zMin,
        zMax: parent.zMax,
      },
      {
        offset: parent.offset + leftLength,
        length: parent.length - leftLength,
        xMin: parent.xMin,
        xMax: parent.xMax,
        yMin: yMid,
        yMax: parent.yMax,
        zMin: parent.zMin,
        zMax: parent.zMax,
      },
    ];
  } else {
    const zMid = (parent.zMin + parent.zMax) >> 1;
    const leftLength = sortedVoxels.filter((v) => v.z < zMid).length;
    return [
      {
        offset: parent.offset,
        length: leftLength,
        xMin: parent.xMin,
        xMax: parent.xMax,
        yMin: parent.yMin,
        yMax: parent.yMax,
        zMin: parent.zMin,
        zMax: zMid,
      },
      {
        offset: parent.offset + leftLength,
        length: parent.length - leftLength,
        xMin: parent.xMin,
        xMax: parent.xMax,
        yMin: parent.yMin,
        yMax: parent.yMax,
        zMin: zMid,
        zMax: parent.zMax,
      },
    ];
  }
}

// 3-kdtree
class VoxelTree {
  #voxels: readonly Voxel[];
  readonly leftChild?: VoxelTree;
  readonly rightChild?: VoxelTree;

  constructor(
    voxels: Voxel[],
    readonly mapping: VoxelSpan,
    readonly axis: Axis,
    readonly depth: number,
  ) {
    this.#voxels = voxels;

    const [leftSpan, rightSpan] = splitSpan(voxels, mapping, axis);
    const nextAxis = nextAxisLoop[axis];

    if (leftSpan.length > MIN_SPAN_LENGTH) {
      this.leftChild = new VoxelTree(voxels, leftSpan, nextAxis, 1 + depth);
    }
    if (rightSpan.length > MIN_SPAN_LENGTH) {
      this.rightChild = new VoxelTree(voxels, rightSpan, nextAxis, 1 + depth);
    }
  }

  get voxels(): readonly Voxel[] {
    return this.#voxels.slice(this.mapping.offset, this.mapping.offset + this.mapping.length);
  }
  get isLeaf(): boolean {
    return !this.leftChild && !this.rightChild;
  }
}

export function buildVoxelTree(voxelModel: VoxelModel): VoxelTree {
  const maxDimension = Math.max(voxelModel.size.x, voxelModel.size.y, voxelModel.size.z);
  const nextPower2 = 2 ** Math.ceil(Math.log2(maxDimension));

  const initialSpan: VoxelSpan = {
    offset: 0,
    length: voxelModel.voxels.length,
    xMin: 0,
    xMax: nextPower2,
    yMin: 0,
    yMax: nextPower2,
    zMin: 0,
    zMax: nextPower2,
  };

  return new VoxelTree(voxelModel.voxels.slice(), initialSpan, 'x', 0);
}
