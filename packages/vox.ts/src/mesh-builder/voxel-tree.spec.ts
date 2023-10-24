import { chrFoxVox, monu8Vox, monu0Vox } from '../__test__/ref-models';
import { basicParser } from '../parser/basic-parser';
import { buildVoxelTree } from './voxel-tree';

describe('VoxelTree', () => {
  it('builds kdtree from few voxels', () => {
    const parsed = basicParser(chrFoxVox);
    const build = buildVoxelTree(parsed.models[0], 2 ** 3);
    expect(build).toMatchSnapshot('buildVoxelTree(chrFox.vox)');
  });

  it('builds kdtree from a lot of voxels', () => {
    const parsed = basicParser(monu0Vox);
    const build = buildVoxelTree(parsed.models[0], 8 ** 3);
    expect(build).toMatchSnapshot('buildVoxelTree(monu0.vox)');
  });

  it('builds kdtree from quite a lot of voxels', () => {
    const parsed = basicParser(monu8Vox);
    const build = buildVoxelTree(parsed.models[0], 8 ** 3);
    expect(build).toMatchSnapshot('buildVoxelTree(monu8.vox)');
  });
});
