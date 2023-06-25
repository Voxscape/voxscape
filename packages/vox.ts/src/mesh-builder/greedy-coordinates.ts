import * as Vox from '../types/vox-types';

export const facetDirection = Object.freeze({
  xPlus: 0,
  xMinus: 1,
  yPlus: 2,
  yMinus: 3,
  zPlus: 4,
  zMinus: 5,
});

export function buildXPlus(v1: Vox.Voxel, v2: Vox.Voxel) {
  const { x, y } = v1;

  return [
    //
    x - 1,
    y,
    v1.z - 1,
    //
    x - 1,
    y - 1,
    v2.z,
    //
    x - 1,
    y - 1,
    v1.z - 1,
    //
    x - 1,
    y - 1,
    v2.z,
    //
    x - 1,
    y,
    v1.z - 1,
    //
    x - 1,
    y,
    v2.z,
  ];
}

export function buildXMinus(v1: Vox.Voxel, v2: Vox.Voxel) {
  const { x, y } = v1;
  return [
    // triangle 1
    x,
    y,
    v2.z,
    //
    x,
    y - 1,
    v1.z - 1,
    //
    x,
    y - 1,
    v2.z,
    // triangle 2
    x,
    y - 1,
    v1.z - 1,
    //
    x,
    y,
    v2.z,
    //
    x,
    y,
    v1.z - 1,
  ];
}

export function buildYPlus(v1: Vox.Voxel, v2: Vox.Voxel) {
  const { x, y } = v1;
  return [
    // triangle 1
    x - 1,
    y - 1,
    v2.z,
    x,
    y - 1,
    v1.z - 1,
    x - 1,
    y - 1,
    v1.z - 1,
    // triangle 2
    x,
    y - 1,
    v1.z - 1,
    x - 1,
    y - 1,
    v2.z,
    x,
    y - 1,
    v2.z,
  ];
}

export function buildYMinus(v1: Vox.Voxel, v2: Vox.Voxel) {
  const { x, y } = v1;
  return [
    // triangle 1
    x - 1,
    y,
    v1.z - 1,
    x,
    y,
    v2.z,
    x - 1,
    y,
    v2.z,
    // triangle 2
    x,
    y,
    v2.z,
    x - 1,
    y,
    v1.z - 1,
    x,
    y,
    v1.z - 1,
  ];
}

export function buildZMinus(v1: Vox.Voxel, v2: Vox.Voxel) {
  const { x, y } = v1;

  return [
    // 2 triangles look from z+ direction, clockwise
    // p1
    x - 1,
    y,
    v2.z,
    // p2
    x,
    y - 1,
    v2.z,
    // p3
    x - 1,
    y - 1,
    v2.z,
    // p4
    x,
    y - 1,
    v2.z,
    // p5
    x - 1,
    y,
    v2.z,
    // p6
    x,
    y,
    v2.z,
  ];
}

export function buildZPlus(v1: Vox.Voxel, v2: Vox.Voxel) {
  const { x, y } = v1;
  return [
    // 2 triangles looking from z-axis, clockwise
    x,
    y,
    v1.z - 1,
    x - 1,
    y - 1,
    v1.z - 1,
    x,
    y - 1,
    v1.z - 1,
    x - 1,
    y - 1,
    v1.z - 1,
    x,
    y,
    v1.z - 1,
    x - 1,
    y,
    v1.z - 1,
  ];
}
