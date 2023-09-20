import { Engine } from '@babylonjs/core';
import { PropsWithoutRef, ReactElement, RefObject, useEffect } from 'react';
import { createDebugLogger } from '../../../shared/logger';
import { createDefaultEngine } from '@voxscape/vox.ts/src/babylon/factory';
import { useAsyncResource, usePromisedRef } from '../../hooks/use-sync-resource';
import { usePromised } from '@jokester/ts-commonutil/lib/react/hook/use-promised';
import { useWindowSize } from 'react-use';

const logger = createDebugLogger(__filename);

export function BabylonEngineProvider(
  props: PropsWithoutRef<{
    canvasRef: RefObject<HTMLCanvasElement>;
    children(value: Engine): ReactElement;
    autoResize?: boolean;
  }>,
): ReactElement {
  const canvasP = usePromisedRef(props.canvasRef);
  const windowSize = useWindowSize();
  const engineP = useAsyncResource<Engine, HTMLCanvasElement>(
    async (canvas) => {
      logger('creating engine');
      return createDefaultEngine(canvas);
    },
    (engine) => {
      logger('disposing engine');
      engine.dispose();
    },
    canvasP,
  );
  const engine = usePromised(engineP);
  const autoResize = props.autoResize ?? true;

  useEffect(() => {
    if (!autoResize) {
      return;
    }
    engineP.then((engine) => {
      engine.resize();
    });
  }, [autoResize && windowSize.height, autoResize && windowSize.width]);

  if (engine.fulfilled) {
    return props.children(engine.value);
  }
  return null!;
}
