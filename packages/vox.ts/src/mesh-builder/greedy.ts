import type * as VoxTypes from '../types/vox-types';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';
import { buildXMinus, buildXPlus, buildYMinus, buildYPlus, buildZMinus, buildZPlus } from './greedy-coordinates';

/**
 *
 */
export interface FacetSpec {
  start: VoxTypes.Voxel;
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

export interface VoxelSegment {
  colorIndex: number;
  voxels: VoxTypes.Voxel[];
}

function getLastVoxel(voxels: readonly VoxTypes.Voxel[]): null | VoxTypes.Voxel {
  return voxels[voxels.length - 1];
}

/**
 * split a row (voxels of same x,y) of voxels into group
 * @param voxels
 * @returns segments. Each segment contains consequtive voxels with same color.
 */
export function splitRow(voxels: VoxTypes.Voxel[]): VoxelSegment[] {
  const segments: VoxelSegment[] = [];

  for (let i = 0; i < voxels.length; i++) {
    const lastSegment = segments[segments.length - 1];
    const lastVoxel = lastSegment && getLastVoxel(lastSegment.voxels);
    if (lastVoxel && lastVoxel.z === voxels[i].z - 1 && lastVoxel.colorIndex === voxels[i].colorIndex) {
      lastSegment.voxels.push(voxels[i]);
    } else {
      segments.push({ colorIndex: voxels[i].colorIndex, voxels: [voxels[i]] });
    }
  }
  return segments;
}

function buildSegmentSpec(x: number, y: number, segment: VoxelSegment) {
  const v1 = segment.voxels[0]; // of smaller z
  const v2 = segment.voxels[segment.voxels.length - 1]; // of larger z

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
export function* extractSurfacesGreedy(
  voxels: readonly VoxTypes.Voxel[],
  batchSize = -1,
): IterableIterator<SurfaceBatch> {
  const facets: FacetSpec[] = [];

  const index = createVoxelIndexFull(voxels);

  for (const [x, yzGrid] of index) {
    for (const [y, zRow] of yzGrid) {
      const segments = splitRow(zRow.voxels);

      segments.forEach((s) => {
        const coordinaes = buildSegmentSpec(x, y, s);

        facets.push({
          start: s.voxels[0],
          colorIndex: s.colorIndex,
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
  voxels: VoxTypes.Voxel[];
  // set: Set<number>;
}

/**
 *
 * @param voxels
 * @return x => y => ROW
 */
function createVoxelIndexFull(voxels: readonly VoxTypes.Voxel[]): ReadonlyMap<number, ReadonlyMap<number, IndexedRow>> {
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
