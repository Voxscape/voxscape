import type { Scene } from '@babylonjs/core';
import type { babylonAllDeps } from './babylon-deps';

/**
 * likely taken from babylon forum
 * @param {number} size
 * @param {Scene} scene
 * @param {typeof babylonAllDeps} deps
 * @fixme return a mesh
 */
export function createRefAxes(size: number, scene: Scene, deps: typeof babylonAllDeps) {
  const makeTextPlane = function (text: string, color: string, planeSize: number) {
    const dynamicTexture = new deps.DynamicTexture('DynamicTexture', 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true);
    const plane = deps.Mesh.CreatePlane('TextPlane', planeSize, scene, true);
    const material = (plane.material = new deps.StandardMaterial('TextPlaneMaterial', scene));
    plane.material.backFaceCulling = false;
    material.specularColor = new deps.Color3(0, 0, 0);
    material.diffuseTexture = dynamicTexture;
    return plane;
  };
  const axisX = deps.Mesh.CreateLines(
    'axisX',
    [
      deps.Vector3.Zero(),
      new deps.Vector3(size, 0, 0),
      new deps.Vector3(size * 0.95, 0.05 * size, 0),
      new deps.Vector3(size, 0, 0),
      new deps.Vector3(size * 0.95, -0.05 * size, 0),
    ],
    scene,
    false,
  );
  axisX.color = new deps.Color3(1, 0, 0);
  const xChar = makeTextPlane('X', 'red', size / 10);
  xChar.position = new deps.Vector3(0.9 * size, -0.05 * size, 0);
  const axisY = deps.Mesh.CreateLines(
    'axisY',
    [
      deps.Vector3.Zero(),
      new deps.Vector3(0, size, 0),
      new deps.Vector3(-0.05 * size, size * 0.95, 0),
      new deps.Vector3(0, size, 0),
      new deps.Vector3(0.05 * size, size * 0.95, 0),
    ],
    scene,
    false,
  );
  axisY.color = new deps.Color3(0, 1, 0);
  const yChar = makeTextPlane('Y', 'green', size / 10);
  yChar.position = new deps.Vector3(0, 0.9 * size, -0.05 * size);
  const axisZ = deps.Mesh.CreateLines(
    'axisZ',
    [
      deps.Vector3.Zero(),
      new deps.Vector3(0, 0, size),
      new deps.Vector3(0, -0.05 * size, size * 0.95),
      new deps.Vector3(0, 0, size),
      new deps.Vector3(0, 0.05 * size, size * 0.95),
    ],
    scene,
    false,
  );
  axisZ.color = new deps.Color3(0, 0, 1);
  const zChar = makeTextPlane('Z', 'blue', size / 10);
  zChar.position = new deps.Vector3(0, 0.05 * size, 0.9 * size);
}
