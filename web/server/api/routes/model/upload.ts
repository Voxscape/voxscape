import { privateProcedure } from '../../common/session.middleware';
import { getBucket } from '../../../external/gcp';
import { uploadModelAssetRequest } from './vox';
import { z } from 'zod';

const findByUserQuery = z.object({
  userId: z.string(),
});

export const requestUpload = privateProcedure.input(uploadModelAssetRequest).mutation(async ({ input, ctx }) => {
  const pathInBucket = `u-${ctx.session.user.id}/models/${Date.now()}-${input.filename}`;
  const [uploadUrl] = await getBucket()
    .file(pathInBucket)
    .getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 3 * 3600e3, // 3hr
      contentType: input.contentType, // MUST match the followed PUT request
      virtualHostedStyle: false, // too complicated / restrictive to use custom domain
      // extensionHeaders: {
      //   'Content-Disposition': encodeURIComponent(input.filename),
      // },
    });

  const publicUrl = new URL(uploadUrl);
  publicUrl.search = '';

  return {
    uploadUrl,
    publicUrl: publicUrl.toString(),
  };
});
