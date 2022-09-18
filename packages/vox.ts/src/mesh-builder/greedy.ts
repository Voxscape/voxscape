import * as VoxTypes from '../types/vox-types';
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

  const indexXyz = createVoxelIndexFull(model.voxels, ['x', 'y', 'z']);
  indexXyz.forEach((grid, x) => {
    grid.forEach((row, y) => {
      for (let start = 0; start < row.voxels.length; ) {
        let count = 1;
        while (
          start + count < row.voxels.length &&
          row.voxels[start + count].colorIndex === row.voxels[start].colorIndex &&
          row.voxels[start + count].z === 1 + row.voxels[start + count - 1].z
        ) {
          ++count;
        }

        const firstVoxel = row.voxels[start];
        const lastVoxel = row.voxels[start + count - 1];

        facets.push({
          // FIXME
          p1: [x, y, firstVoxel.z],
          p2: [x, y, firstVoxel.z],
          p3: [x, y, firstVoxel.z],
          color: palette[firstVoxel.colorIndex],
        });

        start += count;
      }
    });
  });

  yield batch;
}

type AxisSpec = 'x' | 'y' | 'z';

interface IndexedRow {
  voxels: VoxTypes.Voxel[];
  set: Set<number>;
}

function createVoxelIndexFull(
  voxels: readonly VoxTypes.Voxel[],
  axis: readonly [AxisSpec, AxisSpec, AxisSpec],
): ReadonlyMap<number, ReadonlyMap<number, IndexedRow>> {
  const [axis0, axis1, axis2] = axis;
  const built = new DefaultMap<number, DefaultMap<number, IndexedRow>>(
    (axis0) => new DefaultMap((axis1) => ({ voxels: [], set: new Set<number>() })),
  );

  voxels.forEach((v) => {
    const row = built.getOrCreate(v[axis0]).getOrCreate(v[axis1]);
    row.voxels.push(v);
    row.set.add(v[axis2]);
  });
  built.forEach((grid) => {
    grid.forEach((row) => {
      row.voxels.sort((v1, v2) => v1[axis2] - v2[axis2]);
    });
  });
  return built;
}
