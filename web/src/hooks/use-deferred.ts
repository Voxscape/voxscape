import { Deferred } from '@jokester/ts-commonutil/lib/concurrency/deferred';
import { useSingleton } from 'foxact/use-singleton';
import { createDebugLogger } from '../../shared/logger';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';

const logger = createDebugLogger(__filename);

export function useDeferred<T>(rejectOnUnmount = false): Deferred<T> {
  const ref = useSingleton<Deferred<T>>(() => new Deferred<T>());
  useAsyncEffect(
    async () => {
      if (rejectOnUnmount && !ref.current.resolved) {
        logger(`useDeferred: reject() on unmount`);
        ref.current.reject(new Error('useDeferred(): unmounted'));
      }
    },
    [],
  );
  return ref.current;
}
