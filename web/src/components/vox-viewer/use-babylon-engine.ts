import { Engine } from '@babylonjs/core';
import { Deferred } from '@jokester/ts-commonutil/lib/concurrency/deferred';
import { RefObject, useEffect } from 'react';
import { useSingleton } from 'foxact/use-singleton';
import { useKeyGenerator } from '../../hooks/use-key-generator';
import { createDefaultEngine } from '@voxscape/vox.ts/src/demo/babylon/babylon-context';
import { useAsyncEffect2 } from '../../hooks/use-async-effect2';
import { createDebugLogger } from '../../../shared/logger';

const logger = createDebugLogger(__filename);

export interface BabylonEngineRef {
  canvasRef: RefObject<HTMLCanvasElement>;
  initialized: PromiseLike<Engine>;
  released: PromiseLike<void>;
}

interface RealRef extends BabylonEngineRef {
  initialized: Deferred<Engine>;
  released: Deferred<void>;
}

export function useBabylonEngine(canvasRef: RefObject<HTMLCanvasElement>): BabylonEngineRef {
  const ref = useSingleton<RealRef>(() => ({
    canvasRef,
    initialized: new Deferred<Engine>(),
    released: new Deferred<void>(),
  }));
  const refCount = useKeyGenerator(canvasRef, ref);

  logger(`refCount`, refCount);

  useEffect(() => {
    if (!canvasRef.current) {
      ref.current.initialized.reject(new Error(`canvasRef.current is null`));
    }

    if (canvasRef?.current && !ref.current.initialized.resolved) {
      const engine = createDefaultEngine(canvasRef.current);
      ref.current.initialized.fulfill(engine);
      console.debug(`engine initialized`, engine);
    }
  }, [canvasRef, ref]);

  useAsyncEffect2(
    async (running, released) => {
      const [engine] = await Promise.all([ref.current.initialized, released]);

      if (engine) {
        try {
          logger(`before engine.dispose()`);
          engine.dispose();
        } catch (e) {
          logger(`error in engine.dispose()`, e);
        }
      }

      ref.current.released.fulfill();
    },
    [],
    true,
  );

  return ref.current;
}
