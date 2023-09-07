import { BabylonEngineRef } from './use-babylon-engine';
import { useToggle } from 'react-use';
import { useAsyncEffect2 } from '../../hooks/use-async-effect2';

export function useBabylonInspector(engineRef: BabylonEngineRef) {
  const [enabled, toggler] = useToggle(false);

  useAsyncEffect2(
    async (running, released) => {
      await Promise.race([released, import('@babylonjs/core/Debug/debugLayer'), import('@babylonjs/inspector')]);

      console.debug("i'm running");
    },
    [engineRef],
    true,
  );

  return [enabled, toggler] as const;
}
