export const mimeTypes = {
  vox: 'application/magicavoxel.vox',
};

export function matchModelContentType(filenameOrPath: string): string | null {
  const stripped = filenameOrPath.split('.').pop();
  return mimeTypes[stripped as keyof typeof mimeTypes] ?? null;
}
