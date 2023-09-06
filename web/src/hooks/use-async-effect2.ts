import { DependencyList, RefObject, useEffect } from 'react';
import { Deferred } from '@jokester/ts-commonutil/lib/concurrency/deferred';

const nextTick = Promise.resolve();

/**
 * @deprecated use updated useAsyncEffect
 */
export function useAsyncEffect2(
  effectCallback: (
    running: RefObject<boolean>,
    released: PromiseLike<void>,
  ) => Promise</* cleanup should be done with released */ void>,
  deps?: DependencyList,
  preventDuplicatedRun = false,
): void {
  useEffect(() => {
    const mounted = { current: true };

    const effectReleased = new Deferred<void>(true);

    const run = preventDuplicatedRun
      ? async () => {
          if ((await nextTick, !mounted.current)) return;
          return effectCallback(mounted, effectReleased);
        }
      : () => effectCallback(mounted, effectReleased);
    if (typeof setImmediate === 'function') {
      setImmediate(run);
    } else {
      setTimeout(run);
    }

    return () => {
      effectReleased.fulfill();
      mounted.current = false;
    };
  }, deps);
}
