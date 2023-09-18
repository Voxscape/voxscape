import { privateProcedure } from '../../common/session.middleware';
import { composeUserAssetPath, getBucket } from '../../../external/gcp';
import { uploadModelAssetRequest } from './vox';

export const requestUpload = privateProcedure.input(uploadModelAssetRequest).mutation(async ({ input, ctx }) => {
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
