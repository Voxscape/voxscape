import * as Vox from '../types/vox-types';
import { Scene } from '@babylonjs/core/scene';
import { Mesh, VertexData } from '@babylonjs/core/Meshes';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';
import { Material } from '@babylonjs/core';
import { StandardMaterial } from '@babylonjs/core/Materials';
import { buildBabylonColor3 } from './util';
import { buildVertexIndex, extractSurfacesGreedy } from '../mesh-builder/greedy';

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
  const materials = new DefaultMap<number, Material>((colorIndex) => {
    const material = new StandardMaterial(`voxel-material-${colorIndex}`, scene);
    material.diffuseColor = buildBabylonColor3(palette[colorIndex]);
    return material;
  });

  for (const batch of extractSurfacesGreedy(model, palette)) {
    if (shouldStop?.()) {
      return true;
    }
    batch.facets.forEach((facet) => {
      const subMesh = new Mesh(`voxels-${batch.progress.x}-${batch.progress.y}-${facet.z}`);
      const vertexData = new VertexData();
      const positions = facet.positions;
      vertexData.positions = positions;
      vertexData.indices = buildVertexIndex(positions);
      vertexData.applyToMesh(subMesh);
      subMesh.material = materials.getOrCreate(facet.colorIndex);
      subMesh.parent = root;

      root.addChild(subMesh);
    });
  }
  return false;
}
