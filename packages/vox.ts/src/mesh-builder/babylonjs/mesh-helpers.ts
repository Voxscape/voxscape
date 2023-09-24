import { Nullable, Mesh, Scene, MeshBuilder } from '@babylonjs/core';
import { Vector3, Matrix, Quaternion } from '@babylonjs/core/Maths';
import * as VoxTypes from '../../types/vox-types';

export function createModelFrameMesh(
  modelSize: VoxTypes.VoxelModelSize,
  scene: Nullable<Scene>,
  parent: Nullable<Mesh>,
): Mesh {
  const x = modelSize.x + 1;
  const y = modelSize.y + 1;
  const z = modelSize.z + 1;
  // o-a-b-c: rectangle in z=0 plane
  const o = new Vector3(0, 0, 0);
  const a = new Vector3(x, 0, 0);
  const b = new Vector3(x, y, 0);
  const c = new Vector3(0, y, 0);

  // o$-a$-b$-c$: in z=z plane
  const o$ = new Vector3(0, 0, z);
  const a$ = new Vector3(x, 0, z);
  const b$ = new Vector3(x, y, z);
  const c$ = new Vector3(0, y, z);
  const frame = MeshBuilder.CreateLineSystem(
    'frame',
    {
      lines: [
        [o, a],
        [a, b],
        [b, c],
        [c, o],

        [o$, a$],
        [a$, b$],
        [b$, c$],
        [c$, o$],

        [o, o$],
        [a, a$],
        [b, b$],
        [c, c$],
      ],
    },
    scene,
  );
  if (parent) {
    frame.parent = parent;
  }
  return frame;
}

function createNormalizationTransformMatrix(size: VoxTypes.VoxelModelSize): Matrix {
  /**
   * a transform that swaps y/z and places model center at origin
   */
  return Matrix.FromValues(
    // row0
    1,
    0,
    0,
    0,
    // row1
    0,
    0,
    1,
    0,
    // row2
    0,
    1,
    0,
    0,
    // row3
    -(size.x + 1) / 2, // translation-x
    -(size.z + 1) / 2,
    -(size.y + 1) / 2,
    1, //
  );
}

export function createNormalizationTransform(size: VoxTypes.VoxelModelSize): {
  readonly scale: Vector3;
  readonly rotation: Quaternion;
  readonly translation: Vector3;
} {
  const m = createNormalizationTransformMatrix(size);

  const scale = new Vector3();
  const rotation = new Quaternion();
  const translation = new Vector3();

  m.decompose(scale, rotation, translation);
  console.debug('decomposed', scale, rotation, translation);

  return {
    scale,
    rotation,
    translation,
  } as const;
}
