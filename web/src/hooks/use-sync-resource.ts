import { useSingleton } from 'foxact/use-singleton';
import { RefObject, useEffect, Suspense, use, PropsWithoutRef, ReactElement, useState } from 'react';
import { Deferred } from '@jokester/ts-commonutil/lib/concurrency/deferred';
import { useDeferred } from './use-deferred';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { createDebugLogger } from '../../shared/logger';

const logger = createDebugLogger(__filename);

export function useSyncResource<T>(allocate: () => T, release: (t: T) => void): null | T {
  const [value, setValue] = useState<T | null>(null);

  useAsyncEffect(async (running, released) => {
    setValue(allocate());
    await released;
    setValue(null);
  }, []);

  return value;
}

export function usePromisedRef<T>(ref: RefObject<T>): PromiseLike<T> {
  const promised = useSingleton(() => new Deferred<T>());

  useEffect(() => {
    if (ref.current) {
      promised.current.fulfill(ref.current);
    }
  });

  useEffect(() => {
    if (!promised.current.resolved) {
      promised.current.reject('usePromisedReF(): unmounted');
    }
  }, []);

  return promised.current;
}

export function useAsyncResource<T, A = unknown, B = unknown>(
  allocate: (a: A, b?: B) => PromiseLike<T>,
  release: (t: T) => void,
  ...deps: [PromiseLike<A>] | [PromiseLike<A>, undefined | PromiseLike<B>]
): PromiseLike<T> {
  const res = useDeferred<T>();

  useAsyncEffect(async (running, released) => {
    const gotDeps = await Promise.all(deps);
    // @ts-ignore
    const v = await allocate(...gotDeps);
    logger(`useAsyncResource: allocated`, v);
    res.fulfill(v);
    await released;
    release(v);
  }, deps);

  return res;
}
