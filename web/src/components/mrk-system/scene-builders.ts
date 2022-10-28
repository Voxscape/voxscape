import { SceneBuilder } from '../model/babylon-scene-view';

export const createShirtPreviewScene = (textureBlob?: Blob): SceneBuilder => {
  return async (sceneLoader, engine) => {
    const sceneBlob = await fetch('/demo-models/shirt-split.glb').then((res) => res.blob() as Promise<any>);
    sceneBlob.name = 'shirt-split1.gltf';
    const scene = await sceneLoader.LoadAsync('/demo-models/', 'shirt-split.gltf', engine, (ev) =>
      console.debug('progress', ev),
    );
    console.debug(__filename, 'loaded', scene);
    const camera = scene.cameras[0];
    scene.setActiveCameraById(camera.id);
    return scene;
  };
};
