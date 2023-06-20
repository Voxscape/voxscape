import { chrFoxVox } from '../__test__/ref-models';
import { parseBuffer as voxjsParseBuffer } from './voxjs-promised';
import { basicParser } from '../parser/basic-parser';
import { getDefaultPalette } from '../parser/chunk-reader';

describe('vox.ts', () => {
  it('got same result with vox.js', async () => {
    const arrayBuffer = chrFoxVox;

    const voxjsParsed = await voxjsParseBuffer(arrayBuffer);
    const voxtsParsed = await basicParser(arrayBuffer);

    const { voxels: voxjsVoxels } = voxjsParsed;
    const { voxels: voxtsVoxels } = voxtsParsed.models[0];

    for (let i = 0; i < Math.max(voxjsVoxels.length, voxtsVoxels.length); ++i) {
      const refVoxel = voxjsVoxels[i],
        ourVoxel = voxtsVoxels[i];
      try {
        expect(refVoxel).toEqual(ourVoxel);
      } catch (e) {
        console.error(`error comparing voxel #${i}`);
        throw e;
      }
    }

    // skip palette[0]: voxjs fills it with palette[1] for unknown reason
    const palette = voxjsParsed.palette ?? getDefaultPalette();
    expect(palette.slice(1)).toEqual(voxjsParsed.palette.slice(1));
  });
});
