import * as Vox from '../../types/vox-types';
import { Scene } from '@babylonjs/core/scene';
import { Mesh, VertexData } from '@babylonjs/core/Meshes';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';
import { createModelFrameMesh, createNormalizationTransform } from './mesh-helpers';
import { Material } from '@babylonjs/core';
import { StandardMaterial } from '@babylonjs/core/Materials';
import { buildVertexIndex, extractSurfacesGreedy, FacetSpec } from '../greedy';
import { buildBabylonColor3 } from './colors';

export function greedyBuild(
  model: Vox.VoxelModel,
  palette: Vox.VoxelPalette,
  root: Mesh,
  scene: Scene,
  options?: {
    flipXZ?: boolean;
    createFrame?: boolean;
  },
): { stop(): void; stopped: Promise<void> } {
  let running = true;
  if (options?.createFrame ?? false) {
    const frameMesh = createModelFrameMesh(model.size, scene, root);
  }
  if (options?.flipXZ ?? true) {
    const normalize = createNormalizationTransform(model.size);
    root.position = normalize.translation;
    root.rotationQuaternion = normalize.rotation;
    root.scaling = normalize.scale;
  }
  const stopped = startGreedyBuildMesh(model, palette, root, scene, () => !running).then((broke) => {
    console.debug('finished', broke);
  });

  return {
    stopped,
    stop() {
      running = false;
    },
  };
}

async function startGreedyBuildMesh(
  model: Vox.VoxelModel,
  palette: Vox.VoxelPalette,
  root: Mesh,
  scene: Scene,
  shouldStop?: () => boolean,
): Promise<boolean> {
  const materialMap = new DefaultMap<number, Material>((colorIndex) => {
    const material = new StandardMaterial(`voxel-material-${colorIndex}`, scene);
    material.diffuseColor = buildBabylonColor3(palette[colorIndex]);
    return material;
  });

  const submeshMapX = new DefaultMap<number, Mesh>((x) => new Mesh(`voxels-${x}`, null, root));
  const submeshMapXY = new DefaultMap<`voxels-${number}-${number}`, Mesh>((xy) => {
    const [x, y] = xy
      .split('-')
      .slice(1)
      .map((s) => parseInt(s, 10));
    return new Mesh(xy, null, submeshMapX.getOrCreate(x));
  });

  for (const batch of extractSurfacesGreedy(model)) {
    if (shouldStop?.()) {
      return true;
    }
    batch.facets.forEach((facet) => {
      const parent = submeshMapXY.getOrCreate(`voxels-${batch.progress.x}-${batch.progress.y}`);
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
