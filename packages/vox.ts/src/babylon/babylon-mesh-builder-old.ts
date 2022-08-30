import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes';
import { Color4 } from '@babylonjs/core/Maths';
import * as VoxTypes from '../types/vox-types';
import { BabylonDeps } from './babylon-deps';
import { buildBabylonColor } from './util';
import { DefaultMap } from '../util/default-map';

interface ReadonlyVoxelMesh {
  findVoxelMesh(x: number, y: number, z: number): null | Mesh;
  readonly size: VoxTypes.VoxelModelSize;
  readonly parent: Mesh;
  readonly voxelMeshes: Mesh[];
}

/**
 * @param {VoxelModel} model
 * @param {ParsedVoxFile} file
 * @param {Scene} scene
 * @param {BabylonDeps} deps
 * @returns {ReadonlyVoxelMesh}
 * @deprecated this introduces unnecessary faces
 */
export function buildBabylonMeshOld(
  model: VoxTypes.VoxelModel,
  file: VoxTypes.ParsedVoxFile,
  scene: Scene,
  deps: BabylonDeps,
): ReadonlyVoxelMesh {
  const { Mesh, MeshBuilder, Vector3, Color4 } = deps;

  const parent = new Mesh('voxel-parent', scene);

  // x => y => z => Mesh
  const meshMap = new DefaultMap</* x */ number, DefaultMap</* y */ number, Map<number, Mesh>>>(
    (x) => new DefaultMap<number, Map<number, Mesh>>((y) => new Map()),
  );

  // a lazy map for referenced colors
  const faceColorsMap = new DefaultMap<number, Color4[]>((colorIndex) => {
    const c = buildBabylonColor(file.palette[colorIndex], deps);
    return [c, c, c, c, c, c];
  });

  const parentSize = {
    // vox: x-right / y-'deep' / z-top or 'gravity'
    // babylon: x-right / z-'deep' / y-top
    x: model.size.x,
    y: model.size.z,
    z: model.size.y,
  };

  const voxelMeshes: Mesh[] = [];
  for (const v of model.voxels) {
    const { x, z: y, y: z } = v;

    const faceColors = faceColorsMap.getOrCreate(v.colorIndex);
    const m = MeshBuilder.CreateBox(`voxel-${x}-${y}-${z}`, { faceColors });

    m.position = new Vector3(x - parentSize.x / 2, y - parentSize.y / 2, z - parentSize.z / 2);

    meshMap.getOrCreate(x).getOrCreate(y).set(z, m);

    voxelMeshes.push(m);
    parent.addChild(m);
  }

  const findVoxelMesh = (x: number, y: number, z: number) => {
    let yMap, zMap;
    if ((yMap = meshMap.get(x))) {
      if ((zMap = yMap.get(y))) {
        return zMap.get(z) || null;
      }
    }
    return null;
  };

  return { parent: parent, findVoxelMesh, size: parentSize, voxelMeshes };
}
