import type { SceneBuilder } from '../model/babylon-scene-view';
import type { Scene } from '@babylonjs/core';
import { createArcRotateCamera } from '@voxscape/vox.ts/src/demo/babylon/init-babylon';
import { Color3, Color4, Vector3 } from '@babylonjs/core';

export const createShirtPreviewScene = (modelFile: File): SceneBuilder => {
  return async (sceneLoader, engine) => {
    const scene = await sceneLoader.LoadAsync('/blender/', 'shirt-split5.gltf', engine, (ev) =>
      console.debug('progress', ev),
    );
    console.debug(__filename, 'loaded', scene);
    resetColor(scene);
    // resetLight(scene);
    // activeDefaultCamera(scene);
    activeArcCamera(scene);

    return scene;
  };
};

export function resetColor(scene: Scene): void {
  scene.clearColor = Color3.Black().toColor4(0.9);
  scene.ambientColor = Color3.White();
}

export function resetLight(scene: Scene): void {
  scene.lights.forEach((l) => l.dispose());
}

function resetAmbientColor(scene: Scene): void {
  scene.meshes.forEach((mesh) => {});
}

export function activeArcCamera(scene: Scene): void {
  const camera0 = scene.cameras[0];
  camera0.dispose();
  const arcCam = createArcRotateCamera(scene);
  arcCam.position = camera0.position;
  arcCam.target = Vector3.Zero();
  arcCam.lowerRadiusLimit = 2;
  arcCam.radius = 2;
  arcCam.upperRadiusLimit = 6;
  scene.setActiveCameraById(arcCam.id);
  console.debug('cameras cleared', scene.cameras);
}

function activeDefaultCamera(scene: Scene): void {
  const camera = scene.cameras[0];
  scene.setActiveCameraById(camera.id);
}
