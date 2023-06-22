// @ts-nocheck
import * as Vox from '../types/vox-types';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';

export interface FacetSpec {
  p1: readonly [number, number, number];
  p2: readonly [number, number, number];
  p3: readonly [number, number, number];

  color: VoxTypes.VoxelColor;
  // TODO: material?
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

  extractGrid(x: number): FacetSpec[] {
    return [];
  }
}

/**
 * TODO: implement greedy meshing algorithm in https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/
 * @param model
 * @param palette
 * @param batchSize
 */
export function* extractSurfacesGreedy(
  model: VoxTypes.VoxelModel,
  palette: VoxTypes.VoxelPalette,
  batchSize: number,
): IterableIterator<SurfaceBatch> {
  const facets: FacetSpec[] = [];

  const batch: SurfaceBatch = {
    progress: 0,
    facets,
  };

  const indexXyz = createVoxelIndexFull(model.voxels);
  indexXyz.forEach((layer, x) => {
    layer.forEach((row, y) => {
      /**
       * looking along z+ direction
       */
      for (let z = 0; z < row.voxels.length; ) {
        const count = findVoxelSegment(row.voxels, z);

        const firstVoxel = row.voxels[z];
        const lastVoxel = row.voxels[z + count - 1];

        facets.push({
          // FIXME
          p1: [x, y, firstVoxel.z],
          p2: [x, y, firstVoxel.z],
          p3: [x, y, firstVoxel.z],
          color: palette[firstVoxel.colorIndex],
        });

        z += count;
      }
    });
  });

  yield batch;
}

interface IndexedRow {
  voxels: VoxTypes.Voxel[];
  set: Set<number>;
}

/**
 * find
 * @param voxels
 * @param axis
 * @param start
 * @return count of voxels, minimum of 1
 */
export function findVoxelSegment(voxels: readonly VoxTypes.Voxel[], axis: string, start: number): number {
  let count = 1;
  while (
    start + count < voxels.length &&
    voxels[start + count].colorIndex === voxels[start].colorIndex &&
    voxels[start + count][axis] === 1 + voxels[start + count - 1][axis]
  ) {
    ++count;
  }

  return count;
}

/**
 *
 * @param voxels
 * @return x => y => ROW
 */
function createVoxelIndexFull(voxels: readonly VoxTypes.Voxel[]): ReadonlyMap<number, ReadonlyMap<number, IndexedRow>> {
  const built = new DefaultMap<number, DefaultMap<number, IndexedRow>>(
    (x) => new DefaultMap((y) => ({ voxels: [], set: new Set<number>() })),
  );

  voxels.forEach((v) => {
    const row = built.getOrCreate(v.x).getOrCreate(v.y);
    row.voxels.push(v);
    row.set.add(v.z);
  });
  built.forEach((yzGrid, x) => {
    yzGrid.forEach((zRow, y) => {
      zRow.voxels.sort((v1, v2) => v1.z - v2.z);
    });
  });
  return built;
}

type VoxelIndex = ReturnType<typeof createVoxelIndexFull>;
