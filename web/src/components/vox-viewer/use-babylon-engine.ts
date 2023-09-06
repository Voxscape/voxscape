import { Engine } from '@babylonjs/core';
import { Deferred } from '@jokester/ts-commonutil/lib/concurrency/deferred';
import { RefObject, useEffect } from 'react';
import { useSingleton } from 'foxact/use-singleton';

export interface BabylonEngineRef {
  initialized: PromiseLike<Engine>;
  released: PromiseLike<void>;
}

interface RealRef extends BabylonEngineRef {
  initialized: Deferred<Engine>;
  released: Deferred<void>;
}

export function useBabylonEngine(canvasRef: RefObject<HTMLCanvasElement>): BabylonEngineRef {
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
  }, [canvasRef]);

  useEffect(() => {
    return () => {
      ref.current.initialized.then((engine) => {
        try {
          engine.dispose();
        } catch (e) {
          console.error(`error in engine.dispose()`);
          console.error(e);
        }
      });
      ref.current.released.fulfill();
    };
  }, []);

  return ref.current;
}
