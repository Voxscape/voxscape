import * as VoxTypes from '../types/vox-types';
import { Chunk, RiffLense } from '../util/riff-lense';
import { defaultPaletteBytes } from './default-palette';

export function basicParser(bytes: ArrayBuffer, flipYZ = false): VoxTypes.ParsedVoxFile {
  const l = new RiffLense(bytes);

  if (l.asciiAt(0, 4) !== 'VOX ') throw new Error(`expected 'VOX ' at offset=0`);
  if (l.int32At(4) !== 150) throw new Error(`expect 0x150 at offset=4`);

  const mainChunk = l.chunkAt(8);
  if (mainChunk.id !== 'MAIN') throw new Error('expected MAIN chunk');

  const mainChildren = l.childrenChunksIn(mainChunk);

  const models: VoxTypes.VoxelModel[] = [];
  const palette: VoxTypes.VoxelColor[] = [];
  const materials: VoxTypes.VoxelMaterial[] = [];
  for (let chunkIndex = 0; chunkIndex < mainChildren.length; ++chunkIndex) {
    const chunk = mainChildren[chunkIndex];
    if (chunk.id === 'PACK' && chunkIndex === 0) {
      // ignore
    } else if (chunk.id === 'SIZE') {
      const xyzi = mainChildren[chunkIndex + 1];
      if (!(xyzi && xyzi.id === 'XYZI')) {
        throw new Error(`expected 'XYZI' chunk at offset=0x${chunk.end.toString(16)}`);
      }
      models.push(toModel(l, chunk, xyzi, flipYZ));
      ++chunkIndex;
    } else if (chunk.id === 'RGBA') {
      palette.push(...toPalette(l, chunk));
    } else if (chunk.id === 'MATT') {
      materials.push(toMaterial(l, chunk));
    } else {
      switch (chunk.id) {
        case 'nTRN':
        case 'nGRP':
        case 'nSHP':
        case 'LAYR':
        case 'MATL':
        case 'rOBJ':
          // TODO: support extension chunks
          break;

        default:
          throw new Error(`unexpected '${chunk.id}' chunk at offset=0x${chunk.start.toString(16)}`);
      }
    }
  }

  if (!palette.length) {
    palette.push(...defaultPaletteBytes.map(uint32ToColor));
  }

  return {
    models,
    palette,
    materials,
  };
}

function toModel(l: RiffLense, size: Chunk, xyzi: Chunk, flipYZ: boolean): VoxTypes.VoxelModel {
  const x = l.int32At(size.contentStart);
  const y = l.int32At(size.contentStart + 4);
  const z = l.int32At(size.contentStart + 8);
  const voxels: VoxTypes.Voxel[] = [];

  if (flipYZ) {
    for (let p = xyzi.contentStart + 4 /* "4": skip and ignore declared numVoxels */; p < xyzi.end; p += 4) {
      voxels.push({
        x: l.int8At(p),
        y: l.int8At(p + 2),
        z: l.int8At(p + 1),
        colorIndex: l.uint8At(p + 3),
      });
    }
    return {
      size: { x, y: z, z: y },
      voxels,
    };
  } else {
    for (let p = xyzi.contentStart + 4 /* "4": skip and ignore declared numVoxels */; p < xyzi.end; p += 4) {
      voxels.push({
        x: l.int8At(p),
        y: l.int8At(p + 1),
        z: l.int8At(p + 2),
        colorIndex: l.uint8At(p + 3),
      });
    }
    return {
      size: { x, y, z },
      voxels,
    };
  }
}

function toPalette(l: RiffLense, rgba: Chunk): VoxTypes.VoxelPalette {
  const palette: VoxTypes.VoxelColor[] = new Array(256);
  for (let colorIndex = 0; colorIndex < 256; ++colorIndex) {
    const color = uint32ToColor(l.uint32At(rgba.contentStart - 4 + 4 * colorIndex, false) || 0);
    palette[colorIndex] = color;
  }
  return palette;
}

function toMaterial(l: RiffLense, matt: Chunk): VoxTypes.VoxelMaterial {
  const id = l.uint32At(matt.contentStart);
  const type: VoxTypes.VoxelMaterialType = l.uint32At(matt.contentStart + 4) as VoxTypes.VoxelMaterialType;

  if (!(0 <= type && type <= 3))
    throw new Error(`unexpected material type=${type} at 0x${(matt.start + 4).toString(16)}`);

  const weight = l.float32At(matt.contentStart + 8);
  const propertyBits = l.uint32At(matt.contentStart + 12);
  const values: number[] = [];

  return {
    id,
    type,
    weight,
    propertyBits,
    values,
  };
}

export function uint32ToColor(uint32: number): VoxTypes.VoxelColor {
  return {
    r: (uint32 >>> 24) & 0xff,
    g: (uint32 >>> 16) & 0xff,
    b: (uint32 >>> 8) & 0xff,
    a: (uint32 >>> 0) & 0xff,
  };
}
