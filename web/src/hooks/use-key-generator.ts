import { useMemo, useRef } from 'react';

export function useKeyGenerator(...values: unknown[]): number {
  const lastKey = useRef(0);
  return useMemo(() => ++lastKey.current, values);
}
