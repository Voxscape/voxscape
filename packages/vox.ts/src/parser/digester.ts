import { ParsedVoxFile, VoxelModel, VoxelModelSize } from '../types/vox-types';

export interface VoxFileDigest {
  path: string;
  warnings: readonly string[];
  models: {
    size: VoxelModelSize;
    numVoxels: number;
  }[];
}

export function digestFile(path: string, f: ParsedVoxFile): VoxFileDigest {
  return {
    path,
    warnings: f.warnings,
    models: f.models.map((m) => ({
      size: m.size,
      numVoxels: m.voxels.length,
    })),
  };
}
