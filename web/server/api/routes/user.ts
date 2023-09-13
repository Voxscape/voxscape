import { t } from '../common/_base';
import { z } from 'zod';
import { ClientBad } from '../errors';
import { createDebugLogger } from '../../../shared/logger';
import { privateProcedure } from '../common/session.middleware';
import { prisma } from '../../prisma';
import { pagerParam, pickSafeUser } from '../common/primitive';

const logger = createDebugLogger(__filename);

export const userRouter = t.router({
  list: t.procedure
    .input(
      z.object({
        pager: pagerParam.optional(),
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
        users: users.map(pickSafeUser),
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
      logger('reqId', ctx.reqId);
      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });
      if (!user) {
        throw new ClientBad('user not found', 'NOT_FOUND');
      }
      return { user: pickSafeUser(user) };
    }),
  getOwnProfile: privateProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
});
