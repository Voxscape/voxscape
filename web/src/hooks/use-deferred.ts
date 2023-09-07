import { Deferred } from '@jokester/ts-commonutil/lib/concurrency/deferred';
import { useSingleton } from 'foxact/use-singleton';
import { useEffect } from 'react';
import { createDebugLogger } from '../../shared/logger';

const logger = createDebugLogger(__filename);

export function useDeferred<T>(rejectOnUnmount = false): Deferred<T> {
  const ref = useSingleton<Deferred<T>>(() => new Deferred<T>());
  useEffect(() => {
    if (rejectOnUnmount && !ref.current.resolved) {
      logger(`useDeferred: reject() on unmount`);
      ref.current.reject(new Error('unmounted'));
    }
  }, [ref]);
  return ref.current;
}
