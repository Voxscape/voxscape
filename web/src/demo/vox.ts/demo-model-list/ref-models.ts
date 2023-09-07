import { fromCompare, Ord } from 'fp-ts/lib/Ord';
import { Ordering } from 'fp-ts/Ordering';
import { sort } from 'fp-ts/Array';
import { Never } from '@jokester/ts-commonutil/lib/concurrency/timing';
import { VoxFileDigest } from '@voxscape/vox.ts/src/parser/digester';
import { inBrowser } from '../../../config/build-config';

export interface RefModelIndexEntry extends VoxFileDigest {}

async function doFetchRefModelIndex(): Promise<RefModelIndexEntry[]> {
  const res = await fetch('/ref-models/vox/index.ndjson');
  const lines = await res.text();
  const list = lines
    .split(/\r\n|\r|\n/)
    .filter((line) => line.trim())
    .map((line) => {
      return JSON.parse(line) as VoxFileDigest;
    })
    .filter((d) => d.models.length > 0)
    .map((i) => ({
      ...i,
      path: `/ref-models/vox/` + i.path,
    }));

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
