import { triangulate } from './triangulation';
import type * as Vox from '../types/vox-types';
import { getDefaultPalette } from '../parser/chunk-reader';
import { VertexData } from '@babylonjs/core/Meshes';

const demoModel: Vox.VoxelModel = {
  size: { x: 2, y: 2, z: 2 },
  voxels: [{ x: 1, y: 1, z: 1, colorIndex: 3 }],
};

describe('triangulation', () => {
  it('triangulate voxel model into coordinates', () => {
    const triangulated = triangulate(demoModel, getDefaultPalette());

    expect(triangulated).toBeInstanceOf(VertexData);
  });
});
