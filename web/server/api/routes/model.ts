import { z } from 'zod';
import { createDebugLogger } from '../../../shared/logger';
import { prisma } from '../../prisma';
import { requireUserLogin } from '../common/auth';
import { t } from '../common/_base';
import { getBucket } from '../../external/gcp';

enum ModelContentType {
  vox = 'vox',
}

const VoxelModel = z.object({
  id: z.number().optional(),
  contentType: z.enum([ModelContentType.vox]),
  url: z.string(),
});

export const uploadModelAssetRequest = z.object({
  filename: z.string(),
  contentType: z.string(),
});

export const uploadAssetResponse = z.object({
  uploadUrl: z.string().url(),
  url: z.string().url(),
});

const xyz = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

const modelView = z.object({
  id: z.number(),
  cameraPosition: xyz,
  cameraTarget: xyz,
});

const modelList = z.object({
  models: z.array(modelView),
});

export namespace DevOnly {
  export const demoModel = z.object({
    path: z.string(),
  });

  export const demoModelList = z.object({
    demoModels: z.array(demoModel),
  });
}

const logger = createDebugLogger(__filename);
const privateProcedure = t.procedure.use(requireUserLogin);

const searchModelQuery = z.object({
  name: z.ostring(),
});

export const modelsRouter = t.router({
  search: t.procedure.input(searchModelQuery).query(async ({ input }) => {
    const models = await prisma.voxelModel.findMany({ where: {} });
    return [];
  }),
  requestUpload: privateProcedure.input(uploadModelAssetRequest).mutation(async ({ input, ctx }) => {
    const pathInBucket = `u-${ctx.session.user.id}/models/${Date.now()}-${input.filename}`;
    const uploadUrl = await getBucket()
      .file(pathInBucket)
      .getSignedUrl({
        action: 'write',
        expires: Date.now() + 3 * 3600e3, // 3hr
        contentType: input.contentType,
      });
    return {
      uploadUrl: uploadUrl[0],
    };
  }),
});
