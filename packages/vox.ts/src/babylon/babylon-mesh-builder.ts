import * as VoxTypes from '../types/vox-types';
import type { Scene } from '@babylonjs/core/scene';
import { BabylonDeps } from './babylon-deps';
import { Iterators } from '../util/iterator';
import { BabylonMeshBuildProgress, buildBabylonMeshProgressive } from './babylon-mesh-builder-progressive';
import { buildTriangulatedMesh } from '../mesh-builder/triangulation';

export const BabylonMeshBuilder = {
  progessive: buildBabylonMeshProgressive,
  buildTriangulatedMesh,
} as const;
