import { BabylonEngineRef } from './use-babylon-engine';
import { createDebugLogger } from '../../../shared/logger';
import { useDeferred } from '../../hooks/use-deferred';
import { useAsyncEffect2 } from '../../hooks/use-async-effect2';
import { BabylonSceneHandle } from './babylon-scene-handle';

const logger = createDebugLogger(__filename);

class VoxSceneHandle extends BabylonSceneHandle {}

export function useVoxScene(engineRef: BabylonEngineRef): PromiseLike<BabylonSceneHandle> {
  const value = useDeferred<BabylonSceneHandle>();

  useAsyncEffect2(
    async (running, released) => {
      const engine = await Promise.race([released, engineRef.initialized]);
      if (!engine) {
        return;
      }

      const handle = new VoxSceneHandle(engine, engineRef.canvasRef.current!);
      value.fulfill(handle);

      await released;
      handle.dispose();
    },
    [value, engineRef],
    true,
  );

  return value;
}
