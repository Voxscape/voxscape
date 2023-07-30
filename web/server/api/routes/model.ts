import { z } from 'zod';
import { createDebugLogger } from '../../../shared/logger';
import { prisma } from '../../prisma';
import { requireUserLogin } from '../common/session.middleware';
import { t } from '../common/_base';
import { getBucket } from '../../external/gcp';

export const ModelContentType = Object.freeze({
  vox: 'application/vnd.magicavoxel',
});

const VoxelModel = z.object({
  id: z.number().optional(),
  contentType: z.enum([ModelContentType.vox]),
  url: z.string(),
});

export const uploadModelAssetRequest = z.object({
  filename: z.string(),
  contentType: z.string(),
});

const xyz = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

const createModelRequest = z.object({
  contentType: z.string().and(z.enum([ModelContentType.vox])),
  assetUrl: z.string().url(),
  origFilename: z.string(),
  isPrivate: z.boolean(),
  cameraPos: xyz,
  cameraLookAt: xyz,
});

const createViewRequest = z.object({
  modelId: z.number(),
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
  query: z.string(),
});

const findByUserQuery = z.object({
  userId: z.string(),
});

export const modelsRouter = t.router({
  recent: t.procedure.query(async ({ input }) => {
    const models = await prisma.voxelModel.findMany({ where: {}, orderBy: { createdAt: 'desc' }, take: 20 });
    return { models };
  }),

  search: t.procedure.input(searchModelQuery).query(async ({ input }) => {
    const models = await prisma.voxelModel.findMany({ where: {} });
    return [];
  }),
  requestUpload: privateProcedure.input(uploadModelAssetRequest).mutation(async ({ input, ctx }) => {
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
  }),

  create: privateProcedure.input(createModelRequest).mutation(async ({ input, ctx }) => {
    const saved = await prisma.voxelModel.create({
      data: {
        contentType: input.contentType,
        ownerUserId: ctx.session.user.id,
        assetUrl: input.assetUrl,
        isPrivate: input.isPrivate,
        modelViews: {
          create: {
            isDefault: true,
            previewImageUrl: 'TODO',
            ownerUserId: ctx.session.user.id,
            perspective: {
              cameraLookAt: input.cameraLookAt,
              cameraPos: input.cameraPos,
            },
          },
        },
      },
    });

    return [saved];
  }),
});
