import { StandardMaterial } from '@babylonjs/core/Materials';
import { Scene } from '@babylonjs/core/scene';
import { Mesh, MeshBuilder } from '@babylonjs/core/Meshes';
import { Vector3, Color4 } from '@babylonjs/core/Maths';
import vox from 'vox.js';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';

const white = { r: 0, b: 0, g: 0 } as const;

export function buildBabylonMesh(voxelData: vox.VoxelData, scene: Scene) {
  !!StandardMaterial;
  const parent = new Mesh('voxel-parent', scene);

  // x => y => z => Mesh
  const meshMap = new DefaultMap</* x */ number, DefaultMap</* y */ number, Map<number, Mesh>>>(
    (x) => new DefaultMap<number, Map<number, Mesh>>((y) => new Map()),
  );

  // a lazy map for referenced colors
  const faceColorsMap = new DefaultMap<number, Color4[]>((colorIndex) => {
    const { r, g, b } = voxelData.palette[colorIndex] || white;
    const c = new Color4(r / 255, g / 255, b / 255, 1);
    return [c, c, c, c, c, c];
  });

  const parentSize = {
    // vox: x-right / y-'deep' / z-top
    // babylon: x-right / z-'deep' / y-top
    x: voxelData.size.x,
    y: voxelData.size.z,
    z: voxelData.size.y,
  };

  const voxelMeshes: Mesh[] = [];
  for (const v of voxelData.voxels) {
    const { x, z: y, y: z } = v;

    const faceColors = faceColorsMap.getOrCreate(v.colorIndex);
    const m = MeshBuilder.CreateBox(`voxel-${x}-${y}-${z}`, { faceColors });

    m.position = new Vector3(x - parentSize.x / 2, y - parentSize.y / 2, z - parentSize.z / 2);

    meshMap.getOrCreate(x).getOrCreate(y).set(z, m);

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

  return { parent, findVoxelMesh, size: parentSize, voxelMeshes } as const;
}
