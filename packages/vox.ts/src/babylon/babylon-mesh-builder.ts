import * as Vox from '../types/vox-types';
import type { Scene } from '@babylonjs/core/scene';
import {Mesh, MeshBuilder} from "@babylonjs/core/Meshes";
import { Iterators } from '../util/iterator';
import { BabylonMeshBuildProgress, buildBabylonMeshProgressive } from './babylon-mesh-builder-progressive';
import { buildTriangulatedMesh } from '../mesh-builder/triangulation';
import { extractSurfacesGreedy } from "../mesh-builder/greedy";
import { DefaultMap } from "@jokester/ts-commonutil/lib/collection/default-map";
import { Material } from "@babylonjs/core";

export const BabylonMeshBuilder = {
  progessive: buildBabylonMeshProgressive,
  async greedy(),
} as const;


function* greedy(model: Vox.VoxelModel, palette: Vox.VoxelPalette,
                 meshName: string,
                 scene: Scene,

                 ): IterableIterator<Mesh> {

  const root = new Mesh(meshName, scene);

  const materials = new DefaultMap<number, Material>((colorIndex) => {

  })

  for(const batch of extractSurfacesGreedy(model, palette, )) {
    const subMesh =
  }

  return root
}
