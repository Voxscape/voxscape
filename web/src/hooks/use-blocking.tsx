import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { BehaviorSubject, Observable, single } from 'rxjs';
import useConstant from 'use-constant';
import { useExternalObservable } from '@jokester/ts-commonutil/lib/react/hook/use-observable-store';
import { from } from 'rxjs';

interface BlockingState {
  subject: BehaviorSubject<boolean>;
}

const BlockingContextContext = createContext<BlockingState>(null!);

export function BlockingContextProvider(props: { children: ReactNode }) {
  // XXX: what is a consist definition of nested BlockingContext-s?
  const state = useConstant(() => ({ subject: new BehaviorSubject(false) }));

  return <BlockingContextContext.Provider value={state}>{props.children}</BlockingContextContext.Provider>;
}

const alwaysFalse = from([false]);

export function useBlocking2() {
  const stateValue = useContext(BlockingContextContext);

  const blocking = useExternalObservable(alwaysFalse, false);

  const inBlocking = useCallback(
    <A extends unknown[], T>(foo: (...args: A) => PromiseLike<T>): (() => Promise<T>) =>
      async (...args: A) => {
        if (blocking) {
          throw new Error(`already blocking`);
        }
        try {
          stateValue.subject.next(true);
          return await foo(...args);
        } finally {
          stateValue.subject.next(false);
        }
      },
    [blocking],
  );

  return [blocking, inBlocking] as const;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useBlocking() {
  const [blocking, setBlocking] = useState(false);

  const inBlocking = useCallback(
    <A extends unknown[], T>(foo: (...args: A) => PromiseLike<T>): (() => Promise<T>) =>
      async (...args: A) => {
        if (blocking) {
          throw new Error(`already blocking`);
        }
        try {
          setBlocking(true);
          return await foo(...args);
        } finally {
          setBlocking(false);
        }
      },
    [blocking],
  );

  return [blocking, inBlocking] as const;
}
