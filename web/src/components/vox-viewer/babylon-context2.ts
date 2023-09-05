import { Ref, useEffect } from 'react';
import { ArcRotateCamera, Engine, Scene } from '@babylonjs/core';
import { Deferred } from '@jokester/ts-commonutil/lib/concurrency/deferred';
import { useSingleton } from 'foxact/use-singleton';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { createArcRotateCamera } from '@voxscape/vox.ts/src/demo/babylon/babylon-context';

const nextTick = Promise.resolve(1);

interface BabylonEngineRef {
  initialized: PromiseLike<Engine>;
  released: PromiseLike<void>;
}

interface RealRef extends BabylonEngineRef {
  initialized: Deferred<Engine>;
  released: Deferred<void>;
}

export function useBabylonEngine(canvasRef: Ref<HTMLCanvasElement>): BabylonEngineRef {
  const ref = useSingleton<RealRef>(() => ({
    initialized: new Deferred<Engine>(),
    released: new Deferred<void>(),
  }));

  useEffect(() => {
    if (canvasRef?.current) {
      const engine = new Engine(canvasRef.current, true, {
        useHighPrecisionMatrix: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: true,
        antialias: true,
        forceSRGBBufferSupportState: false,
      });
      ref.current.initialized.fulfill(engine);
    }
  }, []);

  useEffect(() => {
    return () => {
      ref.released.resolve();
    };
  }, []);

  return ref.current;
}

class BabylonSceneRef {
  constructor(
    private readonly engine: Engine,
    readonly scene: Scene,
  ) {}

  createArcRotateCamera() {
    const camera = createArcRotateCamera(this.scene);
    this.scene.setActiveCameraById(camera.id);
    return camera;
  }

  setCameraRadius(camera: ArcRotateCamera, lowerDistance: number, upper = lowerDistance) {
    camera.lowerRadiusLimit = lowerDistance;
    camera.upperRadiusLimit = upper;
    camera.radius = 0.5 * (lowerDistance + upper);
  }

  startRenderLoop() {
    this.engine.stopRenderLoop();
    this.engine.runRenderLoop(() => this.scene.render());
  }
  stopRenderLoop() {
    this.engine.stopRenderLoop();
  }
}

export function useVoxScene(engineRef: BabylonEngineRef): PromiseLike<BabylonSceneRef> {
  const value = useAsyncRef<BabylonSceneRef>();

  useAsyncEffect(
    async (running, released) => {
      if (!((await nextTick) && running.current)) {
        return;
      }

      if (!value.resolved && engineRef.initialized.resolved) {
        const scene = new Scene(engineRef.initialized.value);
        value.fulfill(new BabylonSceneRef(engineRef.initialized.value, scene));
      }
    },
    [value, engineRef],
  );

  return value;
}

function useAsyncRef<T>(): Deferred<T> {
  const ref = useSingleton<Deferred<T>>(() => new Deferred<T>());
  useEffect(() => {
    if (!ref.current.resolved) {
      ref.current.reject(new Error('unmounted'));
    }
  }, [ref]);
  return ref.current;
}
