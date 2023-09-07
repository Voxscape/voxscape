import { ArcRotateCamera, Color3, Color4, Engine, HemisphericLight, Scene, Vector3 } from '@babylonjs/core';

export function createArcRotateCamera(scene: Scene, radius = 1): ArcRotateCamera {
  const camera = new ArcRotateCamera(
    'arc-rotate',
    /* alpha: rotation around "latitude axis" */ -Math.PI / 2,
    /* beta: rotation around "longitude axis" */ Math.PI / 2,
    radius,
    Vector3.Zero(),
    scene,
  );
  camera.lowerRadiusLimit = (radius * 2) / 3;
  camera.upperRadiusLimit = (radius * 4) / 3;
  return camera;
}

export function createDefaultScene(engine: Engine): Scene {
  const defaultScene = new Scene(engine);
  defaultScene.clearColor = new Color4(0.1, 0.1, 0.1, 1);
  // console.debug('`wtf', engine.scenes);
  return defaultScene;
}

export function createDefaultEngine(canvas: HTMLCanvasElement) {
  // console.debug('`wtf', canvas);
  return new Engine(canvas, true, {
    useHighPrecisionMatrix: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
    antialias: true,
    forceSRGBBufferSupportState: false,
  });
}

export function createDefaultLight(scene: Scene) {
  const light = new HemisphericLight('default-light', new Vector3(0, 1, 0), scene);
  light.specular = Color3.Black();
  light.groundColor = new Color3(1, 1, 1);
  return light;
}

export function startRunLoop(engine: Engine, scene: Scene) {
  if (!engine.scenes.includes(scene)) {
    throw new Error(`scene not in engine.scenes`);
  }
  if (engine.activeRenderLoops.length) {
    throw new Error(`other rendering loop(s) already running`);
  }
  engine.runRenderLoop(() => {
    // console.debug('rendering frame');
    scene.render();
  });
}
