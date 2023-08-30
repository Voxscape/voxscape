import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { from } from 'rxjs';
import { useSingleton } from 'foxact/use-singleton';
import { useObservable } from 'react-use';

interface BlockingState {
  subject: BehaviorSubject<boolean>;
  wrap<A extends unknown[], T>(foo: (...args: A) => Promise<T>): typeof foo;
}

const BlockingContextContext = createContext<null | BlockingState>(null);

export function BlockingContextProvider(props: { children: ReactNode }) {
  // XXX: what is a consist definition of nested BlockingContext-s?
  const { current } = useSingleton(() => {
    const subject = new BehaviorSubject(false);
    const wrap = <A extends unknown[], T>(foo: (...args: A) => Promise<T>): typeof foo => {
      return async (...args: A): Promise<T> => {
        if (subject.value) {
          throw new Error(`already blocking`);
        }
        try {
          subject.next(true);
          return await foo(...args);
        } finally {
          subject.next(false);
        }
      };
    };
    return { subject, wrap };
  });

  return <BlockingContextContext.Provider value={current}>{props.children}</BlockingContextContext.Provider>;
}

const alwaysFalse = from([false]);

export function useBlocking(): readonly [boolean, BlockingState['wrap']] {
  const stateValue = useContext(BlockingContextContext);
  const latestValue = useObservable(stateValue?.subject ?? alwaysFalse) ?? false;

  if (stateValue) {
    return [latestValue, stateValue.wrap];
  } else {
    console.warn("useBlocking(): called outside of BlockingContextProvider's scope");
    return [false, (foo) => foo];
  }
}

/**
 * @deprecated this does not support nested BlockingContext
 */
function useBlockingV0(): readonly [boolean, BlockingState['wrap']] {
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
