import * as Vox from '../types/vox-types';
import type { Scene } from '@babylonjs/core/scene';
import { Mesh, MeshBuilder, VertexData } from '@babylonjs/core/Meshes';
import { buildBabylonMeshProgressive } from './babylon-mesh-builder-progressive';
import { buildVertexIndex, extractSurfacesGreedy } from '../mesh-builder/greedy';
import { DefaultMap } from '@jokester/ts-commonutil/lib/collection/default-map';
import { Material } from '@babylonjs/core';
import { buildBabylonColor3 } from './util';
import { StandardMaterial } from '@babylonjs/core/Materials';

export const BabylonMeshBuilder = {
  progessive: buildBabylonMeshProgressive,
} as const;
