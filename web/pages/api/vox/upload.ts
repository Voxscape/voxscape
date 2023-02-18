import { NextApiHandler } from 'next';
import { uploadAssetRequest, uploadAssetResponse } from '../../../server/api/schemas';
import { z } from 'zod';

/**
 * POST /api/vox/upload: issue upload url
 */
const post: NextApiHandler = async (req, res): Promise<z.infer<typeof uploadAssetResponse>> => {
  const body = uploadAssetRequest.parse(req.body);

  return uploadAssetResponse.parse({
    url: 'TODO',
    uploadUrl: 'TODO',
  });
};
