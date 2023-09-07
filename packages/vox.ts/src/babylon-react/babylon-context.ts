import { RefObject, useEffect, useState } from 'react';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { ArcRotateCamera, Engine, Scene } from '@babylonjs/core';
import {
  createArcRotateCamera,
  createDefaultEngine,
  createDefaultLight,
  createDefaultScene,
  startRunLoop,
} from '../babylon/factory';

/**
 * an object to control camera/scene/stuff
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

/**
 * @internal
 */
function initBabylon(canvas: HTMLCanvasElement): BabylonContext {
  const engine = createDefaultEngine(canvas);
  console.debug(`engine`, engine);

  const defaultScene = createDefaultScene(engine);

  const camera = createArcRotateCamera(defaultScene);
  camera.attachControl(canvas, false);
  const light = createDefaultLight(defaultScene);

  return {
    engine: {
      instance: engine,

      start() {
        engine.stopRenderLoop();
        startRunLoop(engine, defaultScene);
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
