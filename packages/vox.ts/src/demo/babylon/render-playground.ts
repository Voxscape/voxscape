import { BabylonContext } from './init-babylon';
import { MeshBuilder, Color4, Vector3 } from '@babylonjs/core';

export function renderPlayground(ctx: BabylonContext) {
  const parentMesh = MeshBuilder.CreateBox('box', {
    size: 5,
    faceColors: [
      new Color4(255, 0, 0, 1),
      new Color4(255, 0, 0, 1),
      new Color4(0, 255, 0, 1),
      new Color4(0, 255, 0, 1),
      new Color4(0, 0, 255, 1),
      new Color4(0, 0, 255, 1),
    ],
  });

  const pm = parentMesh.getWorldMatrix();

  const child1 = MeshBuilder.CreateBox('box2', {
    size: 0.2,
  });
  child1.position = new Vector3(0.5, 0.5, 0.5);

  child1.parent = parentMesh;

  const grandchild1 = MeshBuilder.CreateBox('box3', {
    size: 0.1,
  });
  grandchild1.position = new Vector3(0.1, 0.1, 0.1);
  grandchild1.parent = child1;

  ctx.scene.addMesh(parentMesh);
}
