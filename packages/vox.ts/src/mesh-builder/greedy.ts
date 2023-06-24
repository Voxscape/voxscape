import * as Vox from '../types/vox-types';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';

/**
 *
 */
export interface FacetSpec {
  positions: number[] & { [9]: number };
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

export function splitRow(voxels: Vox.Voxel[]): Vox.Voxel[][] {
  const segments: Vox.Voxel[][] = [];

  for (let i = 0; i < voxels.length; i++) {
    const lastSegment = segments[segments.length - 1];
    if (lastSegment && lastSegment[lastSegment.length - 1].colorIndex === voxels[i].z) {
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
