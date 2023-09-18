import { z } from 'zod';
import { createDebugLogger } from '../../../../shared/logger';
import { prisma } from '../../../prisma';
import { privateProcedure } from '../../common/session.middleware';
import { t } from '../../common/_base';
import { mimeTypes } from '../../../../shared/const';
import { pagerParam } from '../../common/primitive';

const logger = createDebugLogger(__filename);

export const uploadModelAssetRequest = z.object({
  filename: z.string(),
  size: z.number(),
  contentType: z.string(),
});

const createModelRequest = z.object({
  contentType: z.string().and(z.enum([mimeTypes.vox])),
  assetUrl: z.string().url(),
  isPrivate: z.boolean(),
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

  create: privateProcedure.input(createModelRequest).mutation(async ({ input, ctx }) => {
    const saved = await prisma.voxFile.create({
      data: {
        contentType: input.contentType,
        ownerUserId: ctx.session.user.id,
        assetUrl: input.assetUrl,
        isPrivate: input.isPrivate,
      },
    });

    return { file: saved };
  }),
});
