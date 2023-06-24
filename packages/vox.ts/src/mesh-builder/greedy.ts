import { set } from 'lodash-es';
import * as Vox from '../types/vox-types';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';

/**
 *
 */
export interface FacetSpec {
  positions: number[]
  // no indexes:
  colorIndex: number;
}

interface SurfaceBatch {
  readonly progress: number;
  readonly facets: readonly FacetSpec[];
}

class GreedyExtractor {
  private readonly index: VoxelIndex;
  constructor(private m: Vox.VoxelModel, private p: Vox.VoxelPalette) {
    this.index = createVoxelIndexFull(m.voxels);
  }
}

function toCoordinates(v: Vox.Voxel) {
  return {
    x1: v.x - 1,
    x2: v.x,
    y1: v.y - 1,
    y2: v.y,
    z1: v.z - 1,
    z2: v.z,
  };
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

/**
 * TODO: implement greedy meshing algorithm in https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/
 * @param model
 * @param palette
 * @param batchSize
 */
export function* extractSurfacesGreedy(
  model: Vox.VoxelModel,
  palette: Vox.VoxelPalette,
  batchSize: number,
): IterableIterator<SurfaceBatch> {
  const facets: FacetSpec[] = [];

  const batch: SurfaceBatch = {
    progress: 0,
    facets,
  };

  const index = createVoxelIndexFull(model.voxels);

  for (const [x, yzGrid] of index) {
    for (const [y, zRow] of yzGrid) {
      const segments = splitRow(zRow.voxels);

      for (const segment of segments) {
        const zStart = segment[0].z;
        const zEnd = segment[segment.length - 1].z;

        facets.push({
        positions: [// TODO */],
          colorIndex: segment[0].colorIndex,
        })
      }
    }
  }
  yield batch;
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
