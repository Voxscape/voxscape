import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';

function first<T>(it: Iterable<T>): T | null {
  for (const i of it) return i;
  return null;
}

function last<T>(it: Iterable<T>): T | null {
  let v: T | null = null;
  for (const i of it) v = i;
  return v;
}

async function toArrayAsync<T>(it: Iterable<T>, yieldDelay: number): Promise<readonly T[]> {
  const yielded: T[] = [];
  for (const t of it) {
    yielded.push(t);
    await wait(yieldDelay);
  }
  return yielded;
}

export const Iterators = {
  first,
  last,
  toArrayAsync,
} as const;
