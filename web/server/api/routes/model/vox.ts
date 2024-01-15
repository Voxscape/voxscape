import { z } from 'zod';
import { createDebugLogger } from '../../../../shared/logger';
import { prisma } from '../../../prisma';
import { privateProcedure } from '../../common/session.middleware';
import { t } from '../../common/_base';
import { pickSafeUser } from '../../common/primitive';
import { decomposeUserAssetUrl, getBucket } from '../../../external/gcp';
import { ClientBad } from '../../errors';
import { mimeTypes } from '../../../../shared/const';

const logger = createDebugLogger(__filename);

const mutateModelRequest = z.object({
  assetUrl: z.ostring(),
  isPrivate: z.oboolean(),
});

const findByUserQuery = z.object({
  userId: z.string(),
});

export const createModelRequest = z.object({
  title: z.string(),
  desc: z.string(),
  origFilename: z.string(),
  contentType: z.string().and(z.enum([mimeTypes.vox])),
  assetUrl: z.string().url(),
  isPrivate: z.boolean(),
});

export const voxRouter = t.router({
  get: t.procedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const model = await prisma.voxFile.findUnique({ where: { id: input.id }, include: { ownerUser: true } });
    if (!model) {
      throw new ClientBad(`model not found`, 'NOT_FOUND');
    }
    return { ...model, ownerUser: pickSafeUser(model.ownerUser) };
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
