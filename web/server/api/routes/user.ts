import { t } from '../common/_base';
import { z } from 'zod';
import { ClientBad } from '../errors';
import { createDebugLogger } from '../../../shared/logger';
import { requireUserLogin } from '../common/session.middleware';
import { prisma } from '../../prisma';
import * as Prisma from '@prisma/client';

const logger = createDebugLogger(__filename);

const privateProcedure = t.procedure.use(requireUserLogin);

export const pagerSchema = z.object({
  limit: z.number({}).int().min(25).max(200).optional(),
  offset: z.number().int().optional(),
});

export const userRouter = t.router({
  list: t.procedure
    .input(
      z.object({
        pager: pagerSchema.optional(),
      }),
    )
    .query(async ({ input }) => {
      const users = await prisma.user.findMany({
        skip: input.pager?.offset,
        take: input.pager?.limit,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return {
        users: users.map(pickSafeFields),
      };
    }),
  getById: t.procedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      logger('input / session', input, ctx.session);
      logger('session.user', ctx.session?.user.id);
      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });
      if (!user) {
        throw new ClientBad('user not found', 'NOT_FOUND');
      }
      return { user: pickSafeFields(user) };
    }),
  getOwnProfile: privateProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
});

export interface SafeUser {
  id: string;
  name?: string;
  imageUrl?: string;
  createdAt: Date;
}

function pickSafeFields(u: Prisma.User): SafeUser {
  return {
    id: u.id,
    name: u.name ?? undefined,
    imageUrl: u.image ?? undefined,
    createdAt: u.createdAt,
  };
}
