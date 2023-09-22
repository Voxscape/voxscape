import type { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import useSWR, { SWRResponse } from 'swr';
import { basicParser } from '@voxscape/vox.ts/src/parser/basic-parser';

const bytesFetcher = async (url: string) =>
  fetch(url)
    .then((res) => res.arrayBuffer())
    .then((bytes) => basicParser(bytes, true, false));

export function useVoxFile(modelUrl?: string): SWRResponse<ParsedVoxFile> {
  return useSWR(modelUrl, bytesFetcher);
}
