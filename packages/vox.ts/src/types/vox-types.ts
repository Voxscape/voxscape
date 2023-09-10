// color: 0~255 ranged int
export interface VoxelColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
  // readonly _hex: number;
}

export interface Voxel {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly colorIndex: number;
}

export type VoxelPalette = readonly VoxelColor[];

export interface VoxelModelSize {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface VoxelModel {
  readonly size: VoxelModelSize;
  readonly voxels: readonly Voxel[];
}

export enum VoxelMaterialType {
  diffuse = 0,
  metal = 1,
  glass = 2,
  emissive = 3,
}

/**
 * a "MATT" chunk
 * see https://github.com/ephtracy/voxel-model/blob/master/MagicaVoxel-file-format-vox.txt
 * (TODO: how are they referenced / used ?)
 */
export interface VoxelMaterial {
  id: number; // uint32
  type: VoxelMaterialType; // uint32
  weight: number; //float32
  propertyBits: number; // uint32
  values: number[]; // float32[]
}

/**
 * as per https://github.com/ephtracy/voxel-model
 */
export interface ParsedVoxFile {
  readonly models: readonly VoxelModel[];
  readonly palette?: VoxelPalette; // falsy when rgba chunk is missing
  readonly materials: readonly VoxelMaterial[];

  readonly enableExtension: boolean;
  readonly warnings: readonly string[];
}
