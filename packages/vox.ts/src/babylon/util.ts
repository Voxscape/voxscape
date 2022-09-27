import { VoxelColor } from '../types/vox-types';
import type { Color4 } from '@babylonjs/core';
import { BabylonDeps } from './babylon-deps';

const white = { r: 0, b: 0, g: 0, a: 255 } as const;

export function buildBabylonColor(maybeColor: undefined | VoxelColor, deps: BabylonDeps): Color4 {
  const { r, g, b, a } = maybeColor || white;
  return new deps.Color4(r / 255, g / 255, b / 255, a / 255);
}
