import { Ord, fromCompare } from 'fp-ts/lib/Ord';
import { Ordering } from 'fp-ts/Ordering';
import { sort } from 'fp-ts/Array';
import { inBrowser } from '@voxscape/web/src/config/build-config';
import { Never } from '@jokester/ts-commonutil/lib/concurrency/timing';
import { VoxFileDigest } from '../parser/digester';

export interface RefModelIndexEntry extends VoxFileDigest {}

async function doFetchRefModelIndex(): Promise<RefModelIndexEntry[]> {
  const res = await fetch('/ref-models-2/index.ndjson');
  const lines = await res.text();
  const list = lines
    .split(/\r\n|\r|\n/)
    .filter((line) => line.trim())
    .map((line) => {
      return JSON.parse(line) as VoxFileDigest;
    })
    .filter((d) => d.models.length > 0);

  const ord: Ord<VoxFileDigest> = fromCompare(
    (a, b) => Math.sign(a.models[0].numVoxels - b.models[0].numVoxels) as Ordering,
  );
  return sort(ord)(list);
}

let fetched: Promise<VoxFileDigest[]> | null = null;

export async function fetchRefModelIndex(): Promise<RefModelIndexEntry[]> {
  if (!inBrowser) {
    return Never;
  }
  return await (fetched ??= doFetchRefModelIndex());
}
