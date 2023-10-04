import { privateProcedure } from '../../common/session.middleware';
import { composeUserAssetPath, getBucket } from '../../../external/gcp';
import { z } from 'zod';
import { t } from '../../common/_base';

const uploadAssetRequest = z.object({
  filename: z.string(),
  size: z.number(),
  contentType: z.string(),
});

const uploadImageRequest = uploadAssetRequest.extend({});

const requestUploadModel = privateProcedure.input(uploadAssetRequest).mutation(async ({ input, ctx }) => {
  const pathInBucket = composeUserAssetPath(ctx.session.user.id, `models/${Date.now()}-${input.filename}`);

  const [uploadUrl] = await getBucket()
    .file(pathInBucket)
    .getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 10 * 60e3, // 10min
      contentType: input.contentType, // MUST match the followed PUT request
      virtualHostedStyle: false, // too complicated / restrictive to use custom domain
      extensionHeaders: {
        'Content-Disposition': encodeURIComponent(input.filename),
      },
    });

  const publicUrl = new URL(uploadUrl);
  publicUrl.search = '';

  return {
    uploadUrl,
    publicUrl: publicUrl.toString(),
  };
});

const requestUploadPreview = privateProcedure.input(uploadImageRequest).mutation(async ({ input, ctx }) => {
  const pathInBucket = composeUserAssetPath(ctx.session.user.id, `models-preview/${Date.now()}-${input.filename}`);

  const [uploadUrl] = await getBucket()
    .file(pathInBucket)
    .getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 10 * 60e3, // 10min
      contentType: input.contentType, // MUST match the followed PUT request
      virtualHostedStyle: false, // too complicated / restrictive to use custom domain
      extensionHeaders: {
        'Content-Disposition': encodeURIComponent(input.filename),
      },
    });

  const publicUrl = new URL(uploadUrl);
  publicUrl.search = '';

  return {
    uploadUrl,
    publicUrl: publicUrl.toString(),
  };
});

export const uploadRouter = t.router({
  model: requestUploadModel,
  preview: requestUploadPreview,
});
