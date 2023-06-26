import { RefObject, useEffect, useState } from 'react';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color3, Color4 } from '@babylonjs/core';

/**
 * a object to control camera/scene/stuff
 */
export interface BabylonContext {
  engine: {
    instance: Engine;
    start(): void;
    stop(): void;
  };
  scene: Scene;
  camera: {
    instance: ArcRotateCamera;
    setRadius(lowerDistance: number, upperDistance?: number): void;
  };
  disposeAll(): void;
}

export function useBabylonContext(canvasRef: RefObject<HTMLCanvasElement>): null | BabylonContext {
  const [ctx, setCtx] = useState<null | BabylonContext>(null);

  useAsyncEffect(async (mounted, effectReleased) => {
    const maybeCanvas = canvasRef.current;
    if (!maybeCanvas) {
      setCtx(null);
      return;
    }

    if (!mounted.current) return;
    const ctx = initBabylon(maybeCanvas);
    setCtx(ctx);

    effectReleased.then(() => ctx.disposeAll());
  }, []);

  return ctx;
}

/**
 * @deprecated this only handles default scene
 */
export function useBabylonInspector(ctx: null | BabylonContext, enabled: boolean): void {
  useEffect(() => {
    let effective = true;
    setTimeout(async () => {
      await import('./babylon-deps-inspector');
      if (effective && ctx) {
        if (enabled) {
          await ctx.scene.debugLayer.show();
        } else {
          await ctx.scene.debugLayer.hide();
        }
      }
    });
    return () => {
      effective = false;
    };
  }, [ctx, enabled]);
}

export function useBabylonDepsPreload(): void {
  useEffect(() => {
    setTimeout(async () => {
      import('./babylon-deps-inspector');
    });
  }, []);
}

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

/**
 * @internal
 */
function initBabylon(canvas: HTMLCanvasElement): BabylonContext {
  const engine = new Engine(canvas, true, {
    useHighPrecisionMatrix: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
    antialias: true,
    forceSRGBBufferSupportState: false,
  });
  const defaultScene = new Scene(engine);

  defaultScene.clearColor = new Color4(0.1, 0.1, 0.1, 1);
  const camera = createArcRotateCamera(defaultScene);
  camera.attachControl(canvas, false);

  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), defaultScene);
  light.specular = Color3.Black();
  light.groundColor = new Color3(1, 1, 1);

  return {
    engine: {
      instance: engine,

      start() {
        engine.stopRenderLoop();
        engine.runRenderLoop(() => defaultScene.render());
      },
      stop() {
        engine.stopRenderLoop();
      },
    },
    scene: defaultScene,
    camera: {
      instance: camera,
      setRadius(lower: number, upper = lower) {
        camera.lowerRadiusLimit = lower;
        camera.upperRadiusLimit = upper;
        camera.radius = upper;
      },
    },

    disposeAll() {
      engine.stopRenderLoop();
      camera.detachControl();
      camera.dispose();

      defaultScene.dispose();
      engine.dispose();
    },
  } as const;
}