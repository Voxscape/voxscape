import * as VoxTypes from '../../types/vox-types';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';
import { createModelFrameMesh, createNormalizationTransform } from './mesh-helpers';
import { Mesh, MeshBuilder, Scene } from '@babylonjs/core';
import { Color4 } from '@babylonjs/core/Maths';
import { buildBabylonColor } from './colors';

export interface BabylonMeshBuildProgress {
  startAt: number;
  root: Mesh;
  finishAt?: number;

  progress: number;
}

const Neighbors = [
  /* dx, dy, dz */
  [-1, 0, 0],
  [1, 0, 0],
  [0, -1, 0],
  [0, 1, 0],
  [0, 0, -1],
  [0, 0, 1],
] as const;

/**
 * @internal
 * @param {VoxelModel} model
 * @param {VoxelPalette} palette
 * @param {string} meshName
 * @param {Scene} scene
 * @param deps
 * @param batchSize
 * @returns {Generator<BabylonMeshBuildProgress>}
 */
export async function* buildBabylonMeshProgressive(
  model: VoxTypes.VoxelModel,
  palette: VoxTypes.VoxelPalette,
  meshName: string,
  scene: Scene,
  batchSize = 0,
): AsyncGenerator<BabylonMeshBuildProgress> {
  console.debug('buildBabylonMeshProgressive', model, palette);

  // vox (or MagicaVoxel): x-right / y-'deep' / z-top
  // babylon: x-right / z-'deep' / y-top
  const root = new Mesh(meshName, scene);

  {
    const frameMesh = createModelFrameMesh(model.size, scene, root);
  }

  {
    const normalize = createNormalizationTransform(model.size);

    root.position = normalize.translation;
    root.rotationQuaternion = normalize.rotation;
    root.scaling = normalize.scale;
  }

  const progress: BabylonMeshBuildProgress = {
    startAt: Date.now(),
    root,
    progress: 0,
  };

  yield progress;

  /**
   * TODO: this is creating too many surfaces
   * to try:
   * 1. a better meshing algorithm
   * 2. do
   * 3. all voxels in 1 mesh, with a complicated material
   */
  let c: null | CustomPolyhedronProps = null;
  for (const p of extractSurfaces(model.voxels, palette, batchSize)) {
    /**
     * FIXME: kkk
     */
    // const subMesh = MeshBuilder.CreatePolyhedron(`submesh-${++numSubMesh}`, c);
    // subMesh.parent = root; // must preserve local transform of subMesh

    c = p;

    yield {
      ...progress,
      progress: p.progress,
    };
  }

  if (c) {
    console.debug('building final mesh', c);
    const voxelsMesh = MeshBuilder.CreatePolyhedron(`voxels`, c);
    if (0) {
      // this is slow and causes blurry color
      voxelsMesh.visibility = 0;
      console.debug('optimizing indexes');
      await new Promise<void>((f) => voxelsMesh.optimizeIndices(() => f()));
      voxelsMesh.visibility = 1;
      console.debug('optimized');
    }
    voxelsMesh.parent = root;
  }

  return {
    ...progress,
    progress: 1,
    finishAt: Date.now(),
  };
}

interface CustomPolyhedronProps {
  faceColors: Color4[];
  custom: {
    vertex: [number, number, number][];
    face: [number, number, number][];
  };
}

/**
 * @internal
 * @param {readonly Voxel[]} voxels
 * @param {VoxelPalette} palette
 * @param {number} batchSize
 * @returns {Generator<CustomPolyhedronProps & {progress: number}>}
 */
function* extractSurfaces(
  voxels: readonly VoxTypes.Voxel[],
  palette: VoxTypes.VoxelPalette,
  batchSize: number,
): Generator<CustomPolyhedronProps & { progress: number }> {
  const voxelIndex = createVoxelIndex(voxels);

  const faceColors: Color4[] = [];
  const vertex: [number, number, number][] = [];
  const face: [number, number, number][] = [];

  const colorMap = new DefaultMap<number, Color4>((colorIndex) => buildBabylonColor(palette[colorIndex]));
  let numProcessedVoxels = 0;

  /** FIXME: we should merge faces when possible */

  for (const [x, xPlane] of voxelIndex.entries()) {
    for (const [y, xyEdge] of xPlane.entries()) {
      for (const [z, v] of xyEdge.entries()) {
        /**
         * notation:
         * voxel {x=a, y=b, z=c} corresponds to cube {a<=x<a+1, b<=y<b+1, c<=z<c+1}
         */
        const vertexOffset = vertex.length;

        let numCreatedFaces = 0;

        for (const [dx, dy, dz] of Neighbors) {
          if (
            // discard this face if it's covered
            voxelIndex
              .get(x + dx)
              ?.get(y + dy)
              ?.has(z + dz)
          ) {
            continue;
          }

          if (dx === -1) {
            face.push(
              [vertexOffset + 0, vertexOffset + 4, vertexOffset + 6],
              [vertexOffset + 6, vertexOffset + 2, vertexOffset + 0],
            );
            ++numCreatedFaces;
          } else if (dx === 1) {
            face.push(
              [vertexOffset + 1, vertexOffset + 3, vertexOffset + 7],
              [vertexOffset + 7, vertexOffset + 5, vertexOffset + 1],
            );
            ++numCreatedFaces;
          } else if (dy === -1) {
            face.push(
              [vertexOffset + 5, vertexOffset + 4, vertexOffset + 0],
              [vertexOffset + 0, vertexOffset + 1, vertexOffset + 5],
            );
            ++numCreatedFaces;
          } else if (dy === 1) {
            face.push(
              [vertexOffset + 3, vertexOffset + 2, vertexOffset + 6],
              [vertexOffset + 6, vertexOffset + 7, vertexOffset + 3],
            );
            ++numCreatedFaces;
          } else if (dz === -1) {
            face.push(
              [vertexOffset + 0, vertexOffset + 2, vertexOffset + 3],
              [vertexOffset + 3, vertexOffset + 1, vertexOffset + 0],
            );
            ++numCreatedFaces;
          } else if (dz === 1) {
            face.push(
              [vertexOffset + 5, vertexOffset + 7, vertexOffset + 6],
              [vertexOffset + 6, vertexOffset + 4, vertexOffset + 5],
            );
            ++numCreatedFaces;
          }
        }

        if (numCreatedFaces) {
          vertex.push(
            [x, y, z], // offset
            [x + 1, y, z],
            [x, y + 1, z],
            [x + 1, y + 1, z],
            [x, y, z + 1], // offset+4
            [x + 1, y, z + 1],
            [x, y + 1, z + 1],
            [x + 1, y + 1, z + 1],
          );

          // const color = buildBabylonColor(palette[v.colorIndex], deps);
          const color = colorMap.getOrCreate(v.colorIndex);

          // 1 face = 2 colored facets
          for (let i = 0; i < numCreatedFaces; i++) {
            faceColors.push(color, color);
          }
        }

        if (batchSize && !(++numProcessedVoxels % batchSize)) {
          const progress = numProcessedVoxels / voxels.length;
          yield {
            progress,
            faceColors,
            custom: {
              vertex,
              face,
            },
          };
        }
      }
    }
  }

  return {
    progress: 1,
    faceColors,
    custom: {
      vertex,
      face,
    },
  };
}

/**
 * @deprecated a more generic version: {@name createVoxelIndexFull}
 * @param voxels
 */
export function createVoxelIndex(
  voxels: readonly VoxTypes.Voxel[],
): ReadonlyMap<number, ReadonlyMap<number, ReadonlyMap<number, VoxTypes.Voxel>>> {
  // vox: x-right / y-'deep' / z-top or 'gravity'
  // babylon: x-right / z-'deep' / y-top
  // we use x => y => z => voxel here
  const index = new DefaultMap<
    number, // x
    DefaultMap<
      number, // y
      Map<
        number, // z
        VoxTypes.Voxel
      >
    >
  >((x) => new DefaultMap<number, Map<number, VoxTypes.Voxel>>((y) => new Map()));
  for (const v of voxels) {
    index.getOrCreate(v.x).getOrCreate(v.y).set(v.z, v);
  }

  return index;
}
