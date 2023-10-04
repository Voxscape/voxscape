import { privateProcedure } from '../../common/session.middleware';
import { composeUserAssetPath, getBucket } from '../../../external/gcp';
import { z } from 'zod';
import { t } from '../../common/_base';

export const uploadAssetRequest = z.object({
  // not URL-escaped
  filename: z
    .string({})
    .trim()
    .regex(/^[a-zA-Z0-9-_%.]+$/, 'Invalid filename'),
  size: z.number(),
  contentType: z.string(),
});

const uploadImageRequest = uploadAssetRequest.extend({});

async function createUploadUrl(
  pathInBucket: string,
  contentType: string,
  downloadFilename?: string,
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const [uploadUrl] = await getBucket()
    .file(pathInBucket)
    .getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 10 * 60e3, // 10min
      contentType, // MUST match the followed PUT request
      virtualHostedStyle: false, // too complicated / restrictive to use custom domain
      extensionHeaders: {
        ...(downloadFilename && { 'Content-Disposition': encodeURIComponent(downloadFilename) }),
      },
    });

  const publicUrl = new URL(uploadUrl);
  publicUrl.search = '';

  return {
    uploadUrl,
    publicUrl: publicUrl.toString(),
  };
}

const requestUploadModel = privateProcedure.input(uploadAssetRequest).mutation(async ({ input, ctx }) => {
  const pathInBucket = composeUserAssetPath(ctx.session.user.id, `models/${Date.now()}-${input.filename}`);

  return createUploadUrl(pathInBucket, input.contentType, input.filename);
});

const requestUploadPreview = privateProcedure.input(uploadImageRequest).mutation(async ({ input, ctx }) => {
  const pathInBucket = composeUserAssetPath(ctx.session.user.id, `models-preview/${Date.now()}-${input.filename}`);

  return createUploadUrl(pathInBucket, input.contentType, input.filename);
});

export const uploadRouter = t.router({
  model: requestUploadModel,
  preview: requestUploadPreview,
});
