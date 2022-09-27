import vox from 'vox.js';
import { wait } from '../util/timing';

export async function parseBuffer(buffer: ArrayBuffer): Promise<vox.VoxelData> {
  await wait(0);
  return new Promise<vox.VoxelData>((fulfill, reject) => {
    vox.Parser.prototype.parseUint8Array(
      new Uint8Array(buffer),
      (err: unknown, voxelData: undefined | vox.VoxelData) => {
        if (err) reject(err);
        else if (voxelData) fulfill(voxelData);
        else reject(new Error('failed'));
      },
    );
  });
}
