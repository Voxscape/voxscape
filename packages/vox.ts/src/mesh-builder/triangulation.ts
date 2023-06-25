import type { Scene } from '@babylonjs/core/scene';
import { Mesh, VertexData } from '@babylonjs/core/Meshes';
// @ts-ignore
import zeros from 'zeros';
import ndarray from 'ndarray';
// @ts-ignore
import triangulateVoxels from 'voxel-triangulation';
import type * as Vox from '../types/vox-types';
import { getDefaultPalette } from '../parser/chunk-reader';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('vox:mesh-builder:triangulation');

/**
 * mostly a port from https://github.com/FlorianFe/vox-viewer/blob/master/vox-viewer.js
 */
export async function buildTriangulatedMesh(
  f: Vox.VoxelModel,
  palette: Vox.VoxelPalette,
  scene: Scene,
  options?: { name: string },
): Promise<Mesh> {
  const vertexData = triangulate(f, palette);
  const mesh = new Mesh(options?.name ?? 'voxel', scene);
  vertexData.applyToMesh(mesh);

  return mesh;
}

export function triangulate(f: Vox.VoxelModel, palette: Vox.VoxelPalette): VertexData {
  debug('model', f);
  const xyzc: ndarray.NdArray = zeros([f.size.x, f.size.y, f.size.z], 'float');
  f.voxels.forEach((v) => {
    xyzc.set(v.x, v.y, v.z, v.colorIndex);
  });

  debug('voxels', xyzc);
  /**
   * transpose to (y,z,x)=>color ndarray?
   * @xxx why is this required?
   * @see https://numpy.org/doc/stable/reference/generated/numpy.ndarray.transpose.html
   */
  const transposed = xyzc.transpose(1, 2, 0);

  /**
   * @see https://github.com/FlorianFe/voxel-triangulation.js
   */
  const triangulaized: {
    verices: number[];
    normals: number[];
    indices: number[];
    voxelValues: number[];
  } = triangulateVoxels(transposed);

  debug('triangulaized', triangulaized);

  const colors = expandColor(palette);

  /**
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/custom/custom
   */
  const vertexData = new VertexData();
  vertexData.positions = triangulaized.verices;
  vertexData.indices = triangulaized.indices;
  vertexData.normals = triangulaized.normals;
  vertexData.colors = colors;
  return vertexData;
}

function expandColor(palette: Vox.VoxelPalette): Float32Array {
  const BYTE_PER_COLOR = 4; // RGBA
  const flatten = new Array<number>(palette.length * BYTE_PER_COLOR);

  for (let i = 0; i < palette.length; i++) {
    flatten[BYTE_PER_COLOR * i] = palette[i].r;
    flatten[BYTE_PER_COLOR * i + 1] = palette[i].g;
    flatten[BYTE_PER_COLOR * i + 2] = palette[i].b;
    flatten[BYTE_PER_COLOR * i + 3] = palette[i].a;
  }
  return new Float32Array(flatten);
}
