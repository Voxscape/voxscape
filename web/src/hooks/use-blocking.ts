import { useCallback, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useBlocking() {
  const [blocking, setBlocking] = useState(false);

  const inBlocking = useCallback(
    <T>(foo: () => PromiseLike<T>): (() => Promise<T>) =>
      async () => {
        if (blocking) {
          throw new Error(`already blocking`);
        }
        try {
          setBlocking(true);
          return await foo();
        } finally {
          setBlocking(false);
        }
      },
    [blocking],
  );

  return [blocking, inBlocking] as const;
}
