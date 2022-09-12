import * as VoxTypes from '../types/vox-types';
import type { Scene } from '@babylonjs/core/scene';
import { BabylonDeps } from './babylon-deps';
import { Iterators } from '../util/iterator';
import { BabylonMeshBuildProgress, buildBabylonMeshProgressive } from './babylon-mesh-builder-progressive';

export const BabylonMeshBuilder = {
  progessive: buildBabylonMeshProgressive,
} as const;
