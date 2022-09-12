import type { Scene } from '@babylonjs/core/scene';
import type { Engine } from '@babylonjs/core/Engines';
import { RefObject, useEffect, useState } from 'react';
import type { babylonAllDeps } from './deps/babylon-deps';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Deferred } from '@jokester/ts-commonutil/lib/concurrency/deferred';

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
    setRadius(lowerDistance: number, upperDistance: number): void;
  };
  deps: typeof babylonAllDeps;

  disposeAll(): void;
}

export function useBabylonContext(canvasRef: RefObject<HTMLCanvasElement>): null | BabylonContext {
  const [ctx, setCtx] = useState<null | BabylonContext>(null);

  useEffect(() => {
    const maybeCanvas = canvasRef.current;
    if (!maybeCanvas) {
      setCtx(null);
      return;
    }

    let effective = true;
    const effectReleased = new Deferred();

    import('./deps/babylon-deps').then(async (imported) => {
      if (!effective) return;
      const ctx = initBabylon(maybeCanvas, imported.babylonAllDeps);
      setCtx(ctx);

      effectReleased.then(() => ctx.disposeAll());
    });

    return () => {
      effective = false;
      effectReleased.fulfill(0);
    };
  }, []);

  return ctx;
}

export function useBabylonInspector(ctx: null | BabylonContext, enabled: boolean): void {
  useEffect(() => {
    let effective = true;
    setTimeout(async () => {
      await import('./deps/babylon-deps-inspector');
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
      import('./deps/babylon-deps');
      import('./deps/babylon-deps-inspector');
    });
  }, []);
}

/**
 * @internal
 */
function initBabylon(canvas: HTMLCanvasElement, deps: typeof babylonAllDeps): BabylonContext {
  const { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color3, Color4 } = deps;

  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  scene.clearColor = new Color4(0.1, 0.1, 0.1, 1);
  const camera = new ArcRotateCamera(
    'camera',
    /* alpha: rotation around "latitude axis" */ -Math.PI / 2,
    /* beta: rotation around "longitude axis" */ Math.PI / 2,
    1,
    Vector3.Zero(),
    scene,
  );
  camera.attachControl(canvas, false);

  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
  light.specular = Color3.Black();
  light.groundColor = new Color3(1, 1, 1);

  return {
    engine: {
      instance: engine,

      start() {
        engine.runRenderLoop(() => scene.render());
      },
      stop() {
        engine.stopRenderLoop();
      },
    },
    scene,
    camera: {
      instance: camera,
      setRadius(lower: number, upper: number) {
        camera.lowerRadiusLimit = lower;
        camera.upperRadiusLimit = upper;
      },
    },

    disposeAll() {
      engine.stopRenderLoop();
      camera.detachControl();
      camera.dispose();

      scene.dispose();
      engine.dispose();
    },
    deps,
  } as const;
}
