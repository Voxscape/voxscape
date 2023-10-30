import {
  ISimplificationSettings,
  Material,
  Mesh,
  Scene,
  SimplificationType,
  StandardMaterial,
  VertexData,
} from '@babylonjs/core';
import * as VoxTypes from '../../types/vox-types';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';
import { ResourcePool } from '@jokester/ts-commonutil/lib/concurrency/resource-pool';
import { buildBabylonColor3 } from './colors';
import { FacetSpec, buildVertexIndex, extractSurfacesGreedy } from '../greedy';
import { applySwapYz } from './mesh-builder-greedy';

/**
 * build multiple primitive mesh for each colorIndex, and merge with
 * https://doc.babylonjs.com/features/featuresDeepDive/mesh/mergeMeshes
 * (this largely reduces the need to LoD)
 */
export function greedyBuildMerged(
  model: VoxTypes.VoxelModel,
  palette: VoxTypes.VoxelPalette,
  scene: Scene,
  options?: {
    /**
     * @deprecated not used
     */
    simplify?: ISimplificationSettings[];
    swapYz?: boolean;
    // FIXME: support this
    abortSignal?: AbortSignal;
  },
): { built: Promise<Mesh>; stopped?: Promise<boolean> } {
  const materialMap = new DefaultMap<number, Material>((colorIndex) => {
    const material = new StandardMaterial(`voxel-material-${colorIndex}`, scene);
    material.diffuseColor = buildBabylonColor3(palette[colorIndex]);
    return material;
  });

  const voxelsByColor = new DefaultMap<number, { voxels: VoxTypes.Voxel[] }>((colorIndex: number) => ({ voxels: [] }));

  model.voxels.forEach((v) => {
    voxelsByColor.getOrCreate(v.colorIndex).voxels.push(v);
  });

  const submeshesP: Promise<Mesh>[] = [];

  const locks = ResourcePool.multiple([0, 1, 2, 3]);

  voxelsByColor.forEach(({ voxels }, colorIndex) => {
    submeshesP.push(locks.use(() => buildSubmesh(materialMap.getOrCreate(colorIndex), voxels, colorIndex)));
  });

  return {
    built: Promise.all(submeshesP).then(async (submeshes) => {
      const merged: Mesh = await Mesh.MergeMeshesAsync(submeshes, true, true, undefined, undefined, true);
      for (const m of materialMap.values()) {
        m.dispose();
      }
      merged.receiveShadows = true;
      if (options?.swapYz ?? true) {
        applySwapYz(model, merged);
      }
      if (options?.simplify?.length) {
        merged.simplify(options.simplify, true, SimplificationType.QUADRATIC, (mesh, submeshIndex) => {
          console.debug(`simplify done`, mesh, submeshIndex);
        });
      }

      return merged;
    }),
  };
}

async function buildSubmesh(m: Material, voxels: VoxTypes.Voxel[], colorIndex: number): Promise<Mesh> {
  const facets: FacetSpec[] = [];
  for (const batch of extractSurfacesGreedy(voxels)) {
    facets.push(...batch.facets);
  }
  const subMesh = new Mesh(`voxels-color-${colorIndex}`);
  const vertexData = new VertexData();
  const positions = facets.flatMap((f) => f.positions);
  vertexData.positions = positions;
  vertexData.indices = buildVertexIndex(positions);
  vertexData.applyToMesh(subMesh);
  subMesh.material = m;
  return subMesh;
}
