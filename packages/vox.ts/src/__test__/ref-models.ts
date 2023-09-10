import fs from 'fs';
import path from 'path';

/**
 * taken from https://github.com/ephtracy/voxel-model/tree/master/vox/character
 * MAIN { SIZE, XYZI, RGBA }
 */
export const chrFoxVox = readVox('chr_fox.vox');

/**
 * taken from https://github.com/ephtracy/voxel-model/tree/master/vox/anim
 * MAIN { SIZE, XYZI, RGBA }
 */
export const monu8Vox = readVox('monu8.vox');

/**
 * taken from https://github.com/ephtracy/voxel-model/tree/master/vox/monument
 * ANIM ?
 */
export const deerVox = readVox('deer.vox');

function readVox(basename: string): ArrayBuffer {
  return toArrayBuffer(fs.readFileSync(path.join(__dirname, '../../../../ref-models/vox/local', basename)));
}

function toArrayBuffer(orig: Buffer): ArrayBuffer {
  const ret = new ArrayBuffer(orig.length);
  orig.copy(new Uint8Array(ret));
  return ret;
}
