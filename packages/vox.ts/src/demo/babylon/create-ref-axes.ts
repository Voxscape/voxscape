import {
  Color3,
  CreateLines,
  CreatePlane,
  DynamicTexture,
  Mesh,
  Scene,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';

function makeTextPlane(text: string, color: string, planeSize: number, scene: Scene) {
  const dynamicTexture = new DynamicTexture('DynamicTexture', 50, scene, true);
  dynamicTexture.hasAlpha = true;
  dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true);
  const plane = CreatePlane(`text-${text}`, { size: planeSize, updatable: false }, scene);
  const material = (plane.material = new StandardMaterial('TextPlaneMaterial', scene));
  plane.material.backFaceCulling = false;
  material.specularColor = new Color3(0, 0, 0);
  material.diffuseTexture = dynamicTexture;
  return plane;
}

/**
 * likely taken from babylon forum
 * @param {number} size
 * @param {Scene} scene
 */
export function createRefAxes(size: number, scene: Scene): Mesh {
  const group = new Mesh('axis-group', scene);

  {
    const axisX = CreateLines(
      'axisX',
      {
        updatable: false,
        points: [
          Vector3.Zero(),
          new Vector3(size, 0, 0),
          new Vector3(size * 0.95, 0.05 * size, 0),
          new Vector3(size, 0, 0),
          new Vector3(size * 0.95, -0.05 * size, 0),
        ],
      },
      scene,
    );
    axisX.color = new Color3(1, 0, 0);
    const xChar = makeTextPlane('X', 'red', size / 10, scene);
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
    group.addChild(axisX).addChild(xChar);
  }

  {
    const axisY = CreateLines(
      'axisY',
      {
        updatable: false,
        points: [
          Vector3.Zero(),
          new Vector3(0, size, 0),
          new Vector3(-0.05 * size, size * 0.95, 0),
          new Vector3(0, size, 0),
          new Vector3(0.05 * size, size * 0.95, 0),
        ],
      },
      scene,
    );
    axisY.color = new Color3(0, 1, 0);
    const yChar = makeTextPlane('Y', 'green', size / 10, scene);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
    group.addChild(axisY).addChild(yChar);
  }
  {
    const axisZ = CreateLines(
      'axisZ',
      {
        updatable: false,
        points: [
          Vector3.Zero(),
          new Vector3(0, 0, size),
          new Vector3(0, -0.05 * size, size * 0.95),
          new Vector3(0, 0, size),
          new Vector3(0, 0.05 * size, size * 0.95),
        ],
      },
      scene,
    );
    axisZ.color = new Color3(0, 0, 1);
    const zChar = makeTextPlane('Z', 'blue', size / 10, scene);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
    group.addChild(axisZ).addChild(zChar);
  }
  return group;
}
