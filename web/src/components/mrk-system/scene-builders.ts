import type { SceneBuilder } from '../model/babylon-scene-view';

export const createShirtPreviewScene = (modelFile: File): SceneBuilder => {
  return async (__sceneLoader, engine) => {
    const { SceneLoader } = await import('@babylonjs/core/Loading/sceneLoader');
    const scene = await SceneLoader.LoadAsync('', modelFile, engine, (ev) => console.debug('progress', ev));
    console.debug(__filename, 'loaded', scene);
    const camera = scene.cameras[0];
    scene.setActiveCameraById(camera.id);
    return scene;
  };
};
