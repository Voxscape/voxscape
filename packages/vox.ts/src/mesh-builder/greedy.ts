import type * as Vox from '../types/vox-types';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';
import { buildXMinus, buildXPlus, buildYMinus, buildYPlus, buildZMinus, buildZPlus } from './greedy-coordinates';

/**
 *
 */
export interface FacetSpec {
  x: number;
  y: number;
  z: number;
  positions: number[];
  // no indexes:
  colorIndex: number;
}

interface SurfaceBatch {
  readonly progress: {
    x: number;
    y: number;
  };
  readonly facets: readonly FacetSpec[];
}

export function splitRow(voxels: Vox.Voxel[]): Vox.Voxel[][] {
  const segments: Vox.Voxel[][] = [];

  for (let i = 0; i < voxels.length; i++) {
    const lastSegment = segments[segments.length - 1];
    const lastVoxel = lastSegment && lastSegment[lastSegment.length - 1];
    if (lastVoxel && lastVoxel.z === voxels[i].z - 1 && lastVoxel.colorIndex === voxels[i].colorIndex) {
      lastSegment.push(voxels[i]);
    } else {
      segments.push([voxels[i]]);
    }
  }
  return segments;
}

function buildSegmentSpec(x: number, y: number, segment: Vox.Voxel[]) {
  const v1 = segment[0]; // of smaller z
  const v2 = segment[segment.length - 1]; // of larger z

  return {
    v1,
    v2,
    zMinus: buildZMinus(v1, v2),
    zPlus: buildZPlus(v1, v2),
    xMinus: buildXMinus(v1, v2),
    xPlus: buildXPlus(v1, v2),
    yPlus: buildYPlus(v1, v2),
    yMinus: buildYMinus(v1, v2),
  };
}

export function buildVertexIndex(positions: number[]): number[] {
  if (positions.length % 3) {
    throw new Error(`invalid positions: ${positions.length}`);
  }

  return new Array(positions.length / 3).fill(null).map((_, i) => i);
}

/**
 * TODO: implement greedy meshing algorithm in https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/
 * @param model
 * @param batchSize
 */
export function* extractSurfacesGreedy(model: Vox.VoxelModel, batchSize = -1): IterableIterator<SurfaceBatch> {
  const facets: FacetSpec[] = [];

  const index = createVoxelIndexFull(model.voxels);

  for (const [x, yzGrid] of index) {
    for (const [y, zRow] of yzGrid) {
      const segments = splitRow(zRow.voxels);

      segments.forEach((s) => {
        const coordinaes = buildSegmentSpec(x, y, s);

        facets.push({
          x,
          y,
          z: s[0].z,
          colorIndex: s[0].colorIndex,
          positions: [
            coordinaes.zPlus,
            coordinaes.zMinus,
            coordinaes.xPlus,
            coordinaes.xMinus,
            coordinaes.yPlus,
            coordinaes.yMinus,
          ].flat(),
        });
      });

      yield {
        progress: {
          x,
          y,
        },
        facets,
      };
      facets.length = 0;
    }
  }
}

interface IndexedRow {
  voxels: Vox.Voxel[];
  // set: Set<number>;
}

/**
 *
 * @param voxels
 * @return x => y => ROW
 */
function createVoxelIndexFull(voxels: readonly Vox.Voxel[]): ReadonlyMap<number, ReadonlyMap<number, IndexedRow>> {
  const built = new DefaultMap<number, DefaultMap<number, IndexedRow>>(
    (x) =>
      new DefaultMap((y) => ({
        voxels: [],
        // set: new Set<number>()
      })),
  );

  voxels.forEach((v) => {
    const row = built.getOrCreate(v.x).getOrCreate(v.y);
    row.voxels.push(v);
    // row.set.add(v.z);
  });
  built.forEach((yzGrid, x) => {
    yzGrid.forEach((zRow, y) => {
      zRow.voxels.sort((v1, v2) => v1.z - v2.z);
    });
  });
  return built;
}

type VoxelIndex = ReturnType<typeof createVoxelIndexFull>;
