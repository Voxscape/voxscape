import { Ord, fromCompare } from 'fp-ts/lib/Ord';
import { Ordering } from 'fp-ts/Ordering';
import { sort } from 'fp-ts/Array';
import { inBrowser } from '../../config/build-config';
import { Never } from '@jokester/ts-commonutil/lib/concurrency/timing';

export interface RefModelIndexEntry {
  path: string;
  size: number;
  numModels: number;
  numWarnings: number;
}

async function fetchRefModelIndex(): Promise<RefModelIndexEntry[]> {
  const res = await fetch('/_ref-models/index.json');
  const data = await res.json();
  return data;
}

export function fetchBaseModelIndex(): Promise<RefModelIndexEntry[]> {
  if (!inBrowser) {
    return Never;
  }
  const ord: Ord<RefModelIndexEntry> = fromCompare((a, b) => Math.sign(a.size - b.size) as Ordering);
  return fetchRefModelIndex().then((models) => sort(ord)(models));
}
