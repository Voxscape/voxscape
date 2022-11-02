import type { SceneBuilder } from '../model/babylon-scene-view';
import type { Scene } from '@babylonjs/core';
import { createArcRotateCamera } from '@voxscape/vox.ts/src/demo/babylon/init-babylon';
import { Color3, Color4, Vector3 } from '@babylonjs/core';

export const createShirtPreviewScene = (modelFile: File): SceneBuilder => {
  return async (sceneLoader, engine) => {
    const scene = await sceneLoader.LoadAsync('/blender/', 'shirt-split3.gltf', engine, (ev) =>
      console.debug('progress', ev),
    );
    console.debug(__filename, 'loaded', scene);
    resetColor(scene);
    // activeDefaultCamera(scene);
    activeArcCamera(scene);
    return scene;
  };
};

export function resetColor(scene: Scene): void {
  scene.clearColor = Color3.Black().toColor4(0.9);
}

export function activeArcCamera(scene: Scene): void {
  const camera0 = scene.cameras[0];
  const arcCam = createArcRotateCamera(scene);
  const dist = camera0.position.length();
  arcCam.position = camera0.position;
  arcCam.target = Vector3.Zero();
  arcCam.radius = 2;
  // arcCam.lowerRadiusLimit = dist * 3;
  // arcCam.upperRadiusLimit = dist * 5;
  // scene.removeCamera(camera0);
  scene.setActiveCameraById(arcCam.id);
  camera0.dispose();
  console.debug('cameras cleared', scene.cameras);
}

function activeDefaultCamera(scene: Scene): void {
  const camera = scene.cameras[0];
  scene.setActiveCameraById(camera.id);
}
