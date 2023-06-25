import { triangulate } from './triangulation';
import type * as Vox from '../types/vox-types';
import { getDefaultPalette } from '../parser/chunk-reader';
import { VertexData } from '@babylonjs/core/Meshes';
// @ts-ignore
import triangulateVoxels from 'voxel-triangulation';
// @ts-ignore
import zeros from 'zeros';
import ndarray from 'ndarray';

const demoModel: Vox.VoxelModel = {
  size: { x: 2, y: 2, z: 2 },
  voxels: [{ x: 1, y: 1, z: 1, colorIndex: 3 }],
};

function buildNdArray(f: Vox.VoxelModel): ndarray.NdArray {
  const xyzc: ndarray.NdArray = zeros([f.size.x, f.size.y, f.size.z], 'float');
  f.voxels.forEach((v) => {
    xyzc.set(v.x, v.y, v.z, v.colorIndex);
  });
  return xyzc.transpose(1, 2, 0);
}

describe.skip('ndarray', () => {
  it('builds an ndarray from a voxel model', () => {
    const xyzc = buildNdArray(demoModel);
    expect(xyzc).toMatchSnapshot('xyzc');
  });
});

describe.skip('triangulation', () => {
  it('triangulate voxel model into coordinates', () => {
    const triangulated = triangulate(demoModel, getDefaultPalette());

    expect(triangulated).toBeInstanceOf(VertexData);

    expect(triangulated.positions).toEqual([]);
  });
});
