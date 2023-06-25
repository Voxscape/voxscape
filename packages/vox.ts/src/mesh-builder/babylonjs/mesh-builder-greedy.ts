import * as Vox from '../../types/vox-types';
import { Scene } from '@babylonjs/core/scene';
import { Mesh, VertexData } from '@babylonjs/core/Meshes';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';
import { Material } from '@babylonjs/core';
import { StandardMaterial } from '@babylonjs/core/Materials';
import { buildVertexIndex, extractSurfacesGreedy } from '../greedy';
import { buildBabylonColor3 } from './colors';

export function greedyBuild(
  model: Vox.VoxelModel,
  palette: Vox.VoxelPalette,
  meshName: string,
  scene: Scene,
  shouldStop?: () => boolean,
): Mesh {
  const root = new Mesh(meshName, scene);

  startGreedyBuildMesh(model, palette, meshName, root, scene, shouldStop).then((broke) => {
    console.debug('finished', broke);
  });

  return root;
}

async function startGreedyBuildMesh(
  model: Vox.VoxelModel,
  palette: Vox.VoxelPalette,
  meshName: string,
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
      const subMesh = new Mesh(`voxels-${batch.progress.x}-${batch.progress.y}-${facet.z}`, null, parent);
      const vertexData = new VertexData();
      const positions = facet.positions;
      vertexData.positions = positions;
      vertexData.indices = buildVertexIndex(positions);
      vertexData.applyToMesh(subMesh);
      subMesh.material = materialMap.getOrCreate(facet.colorIndex);
    });
  }
  return false;
}
