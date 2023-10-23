import * as VoxTypes from '../../types/vox-types';
import { Scene } from '@babylonjs/core/scene';
import { Mesh, VertexData } from '@babylonjs/core/Meshes';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';
import { createNormalizationTransform } from './mesh-helpers';
import { Material, ModelShape } from '@babylonjs/core';
import { StandardMaterial } from '@babylonjs/core/Materials';
import { buildVertexIndex, extractSurfacesGreedy, FacetSpec } from '../greedy';
import { buildBabylonColor3 } from './colors';

export function applySwapYz(model: VoxTypes.VoxelModel, m: Mesh) {

    const normalize = createNormalizationTransform(model.size);
    m.position = normalize.translation;
    m.rotationQuaternion = normalize.rotation;
    m.scaling = normalize.scale;
}

export function greedyBuild(
  model: VoxTypes.VoxelModel,
  palette: VoxTypes.VoxelPalette,
  root: Mesh,
  scene: Scene,
  options?: {
    abortSignal?: AbortSignal;
    swapYz?: boolean;
  },
): { stopped: Promise<boolean> } {
  if (options?.swapYz ?? true) {
    applySwapYz(model, root)
  }
  const stopped = startGreedyBuildMesh(model, palette, root, scene, () => !!options?.abortSignal?.aborted).then(
    (interrupted) => {
      console.debug('greedyBuild(): interrupted', interrupted);
      return interrupted;
    },
  );

  return {
    stopped,
  };
}

/**
 * @return prematurely stopped
 */
async function startGreedyBuildMesh(
  model: VoxTypes.VoxelModel,
  palette: VoxTypes.VoxelPalette,
  root: Mesh,
  scene: Scene,
  shouldStop?: () => boolean,
): Promise<boolean> {
  const materialMap = new DefaultMap<number, Material>((colorIndex) => {
    const material = new StandardMaterial(`voxel-material-${colorIndex}`, scene);
    material.diffuseColor = buildBabylonColor3(palette[colorIndex]);
    return material;
  });

  const childrenMapX = new DefaultMap<number, Mesh>((x) => new Mesh(`voxels-${x}`, null, root));
  const childrenMapXY = new DefaultMap<`voxels-${number}-${number}`, Mesh>((xy) => {
    const [x, y] = xy
      .split('-')
      .slice(1)
      .map((s) => parseInt(s, 10));
    return new Mesh(xy, null, childrenMapX.getOrCreate(x));
  });

  for (const batch of extractSurfacesGreedy(model.voxels)) {
    if (shouldStop?.()) {
      return true;
    }
    batch.facets.forEach((facet) => {
      const parent = childrenMapXY.getOrCreate(`voxels-${batch.progress.x}-${batch.progress.y}`);
      const subMesh = buildNoLodMesh(facet);
      // TODO: build lod-available meshes
      subMesh.parent = parent; // this is the way to let subMesh inherit parent's transform
      subMesh.material = materialMap.getOrCreate(facet.colorIndex);
    });
  }
  return false;
}

function buildNoLodMesh(facet: FacetSpec): Mesh {
  const subMesh = new Mesh(`voxels-${facet.start.x}-${facet.start.y}-${facet.start.z}`);
  const vertexData = new VertexData();
  const positions = facet.positions;
  vertexData.positions = positions;
  vertexData.indices = buildVertexIndex(positions);
  vertexData.applyToMesh(subMesh);
  return subMesh;
}
