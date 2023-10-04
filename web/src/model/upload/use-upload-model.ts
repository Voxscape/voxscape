import { trpcClient } from '../../config/trpc';
import { matchModelContentType } from '../../../shared/const';

export async function uploadVoxModel(f: File) {
  const contentType = matchModelContentType(f.name);
  if (!contentType) {
    throw new Error(`Unsupported file type: ${f.name}`);
  }

  const uploadCred = await trpcClient.upload.model.mutate({
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
