import { VoxelColor } from '../../types/vox-types';
import { Color4, Color3 } from '@babylonjs/core';

const white = { r: 0, b: 0, g: 0, a: 255 } as const;

export function buildBabylonColor(maybeColor: undefined | VoxelColor): Color4 {
  const { r, g, b, a } = maybeColor || white;
  return new Color4(r / 255, g / 255, b / 255, a / 255);
}

export function buildBabylonColor3(maybeColor: undefined | VoxelColor): Color3 {
  const { r, g, b, a } = maybeColor || white;
  return new Color3(r / 255, g / 255, b / 255);
}
