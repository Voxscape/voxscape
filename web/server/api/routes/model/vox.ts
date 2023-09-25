import { z } from 'zod';
import { createDebugLogger } from '../../../../shared/logger';
import { prisma } from '../../../prisma';
import { privateProcedure } from '../../common/session.middleware';
import { t } from '../../common/_base';
import { pagerParam } from '../../common/primitive';
import { decomposeUserAssetUrl, getBucket } from '../../../external/gcp';
import { ClientBad } from '../../errors';
import { createModelRequest } from '../../../../shared/api-schemas';

const logger = createDebugLogger(__filename);

export const uploadModelAssetRequest = z.object({
  filename: z.string(),
  size: z.number(),
  contentType: z.string(),
});

const mutateModelRequest = z.object({
  assetUrl: z.ostring(),
  isPrivate: z.oboolean(),
});

const findByUserQuery = z.object({
  userId: z.string(),
});

const searchModelQuery = z.object({
  query: z.string(),
});

export const voxRouter = t.router({
  recent: t.procedure.input(pagerParam.optional()).query(async ({ input }) => {
    const models = await prisma.voxFile.findMany({ where: {}, orderBy: { createdAt: 'desc' }, take: 20 });
    return { models };
  }),

  search: t.procedure.input(searchModelQuery).query(async ({ input }) => {
    const models = await prisma.voxFile.findMany({ where: {} });
    return [];
  }),

  get: t.procedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const model = await prisma.voxFile.findUnique({ where: { id: input.id }, include: { ownerUser: true } });
    if (!model) {
      throw new ClientBad(`model not found`, 'NOT_FOUND');
    }
    return model;
  }),

  create: privateProcedure.input(createModelRequest).mutation(async ({ input, ctx }) => {
    const f = decomposeUserAssetUrl(input.assetUrl);
    if (!(ctx.session.user.id && ctx.session.user.id === f?.userId)) {
      throw new ClientBad(`invalid assetUrl`, 'FORBIDDEN');
    }
    await getBucket().file(f.objectKey).makePublic();

    const saved = await prisma.voxFile.create({
      data: {
        title: input.title,
        origFilename: input.origFilename,
        desc: input.desc,
        contentType: input.contentType,
        ownerUserId: ctx.session.user.id,
        assetUrl: input.assetUrl,
        isPrivate: input.isPrivate,
      },
    });

    return { file: saved };
  }),
});
