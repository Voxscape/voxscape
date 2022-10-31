import type { SceneBuilder } from '../model/babylon-scene-view';

export const createShirtPreviewScene = (modelFile: File): SceneBuilder => {
  return async (sceneLoader, engine) => {
    const scene = await sceneLoader.LoadAsync('', modelFile, engine, (ev) => console.debug('progress', ev));
    console.debug(__filename, 'loaded', scene);
    const camera = scene.cameras[0];
    scene.setActiveCameraById(camera.id);
    return scene;
  };
};
