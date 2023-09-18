import { trpcClient } from '../../config/trpc';
import { matchModelContentType } from '../../../shared/const';

export async function uploadVoxModel(f: File) {
  const contentType = matchModelContentType(f.name);
  if (!contentType) {
    throw new Error(`Unsupported file type: ${f.name}`);
  }

  const uploadCred = await trpcClient.models.requestUpload.mutate({
    filename: f.name,
    size: f.size,
    contentType,
  });

  const uploaded = await fetch(uploadCred.uploadUrl, {
    method: 'PUT',
    body: f,
    headers: {
      'content-type': contentType,
      'content-disposition': encodeURIComponent(f.name),
    },
  });
  if (!uploaded.ok) {
    throw new Error(`Failed to upload: ${uploaded.statusText}`);
  }

  return { contentType, publicUrl: uploadCred.publicUrl };
}

export async function createVoxModel(publicUrl: string, contentType: string, isPrivate: boolean) {
  const saved = await trpcClient.models.vox.create.mutate({
    assetUrl: publicUrl,
    contentType,
    isPrivate,
  });

  return saved;
}
