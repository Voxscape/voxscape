import { Engine } from '@babylonjs/core/Engines';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { HemisphericLight } from '@babylonjs/core/Lights';
import { Vector3, Color3, Color4, Matrix, Quaternion } from '@babylonjs/core/Maths';
import { Mesh, MeshBuilder, TransformNode } from '@babylonjs/core/Meshes';
import { DynamicTexture, StandardMaterial } from '@babylonjs/core/Materials';

import { BabylonDeps as MeshBuilderDeps } from '../../../babylon/babylon-deps';

export const babylonMeshDeps: MeshBuilderDeps = {
  Mesh,
  MeshBuilder,
  Color4,
  Vector3,
  Matrix,
  TransformNode,
  Quaternion,
} as const;

export const babylonAllDeps = {
  ...babylonMeshDeps,
  Engine,
  Scene,
  StandardMaterial,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  Color3,
  DynamicTexture,
} as const;
