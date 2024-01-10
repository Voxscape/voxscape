import type * as VoxTypes from '../types/vox-types';
import { RiffLense } from '../util/riff-lense';
import { getDefaultPalette, readMatt, readRgba, readXyzi, uint32ToColor } from './chunk-reader';

/**
 * parser for "basic" vox format
 */
export function basicParser(
  bytes: ArrayBuffer,
  /** @deprecated prefer to swap yz in mesh builder */ flipYZ = false,
  enableExtension = false,
): VoxTypes.ParsedVoxFile {
  const l = new RiffLense(bytes);

  if (l.asciiAt(0, 4) !== 'VOX ') throw new Error(`expected 'VOX ' at offset=0`);
  if (l.int32At(4) !== 150) throw new Error(`expect 0x150 at offset=4`);

  const mainChunk = l.chunkAt(8);
  if (mainChunk.id !== 'MAIN') throw new Error('expected MAIN chunk');

  const mainChildren = l.childrenChunksIn(mainChunk);

  const models: VoxTypes.VoxelModel[] = [];
  let palette: undefined | VoxTypes.VoxelPalette = undefined;
  const materials: VoxTypes.VoxelMaterial[] = [];
  const warnings: string[] = [];
  for (let chunkIndex = 0; chunkIndex < mainChildren.length; ++chunkIndex) {
    const chunk = mainChildren[chunkIndex];
    if (chunk.id === 'PACK' && chunkIndex === 0) {
      // ignore
    } else if (chunk.id === 'SIZE') {
      const xyzi = mainChildren[chunkIndex + 1];
      if (!(xyzi && xyzi.id === 'XYZI')) {
        throw new Error(`expected 'XYZI' chunk at offset=0x${chunk.end.toString(16)}`);
      }
      models.push(readXyzi(l, chunk, xyzi, flipYZ));
      ++chunkIndex;
    } else if (chunk.id === 'RGBA') {
      palette = readRgba(l, chunk);
    } else if (chunk.id === 'MATT') {
      materials.push(readMatt(l, chunk));
    } else {
      switch (chunk.id) {
        case 'MATL':
        case 'nTRN':
        case 'nGRP':
        case 'nSHP':
        case 'LAYR':
        case 'rOBJ':
        case 'STRING':
        case 'DICT':
        case 'ROTATION':
        case 'NOTE':
        case 'IMAP': {
          const msg = `vox.ts: unsupported ${chunk.id} chunk at offset 0x${chunk.start.toString(16)}`;
          warnings.push(msg);
          break;
        }

        default: {
          warnings.push(`vox.ts: unknown ${chunk.id} chunk at offset 0x${chunk.start.toString(16)}`);
          break;
        }
      }
    }
  }

  return {
    models,
    palette: palette ?? getDefaultPalette(),
    materials,
    warnings,
    enableExtension,
  };
}
