/**
 * type-only imports from {@code babylonjs/core} that compiles to nothing.
 */
import type { Mesh, MeshBuilder, TransformNode } from '@babylonjs/core/Meshes';
import type { Vector3, Color4, Matrix, Quaternion } from '@babylonjs/core/Maths';

/**
 * all required babylon deps here
 * so that we can support different builds (es5 / es6 / standalone <script />)
 *
 * caller should ensure all deps (including transitive Material etc) are available
 */
export interface BabylonDeps {
  Mesh: typeof Mesh;
  MeshBuilder: typeof MeshBuilder;
  Vector3: typeof Vector3;
  Color4: typeof Color4;
  Matrix: typeof Matrix;
  TransformNode: typeof TransformNode;
  Quaternion: typeof Quaternion;
}
