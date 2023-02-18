import { t } from '../common/_base';
import { z } from 'zod';
import { ClientBad } from '../errors';
import { createDebugLogger } from '../../../shared/logger';
import { requireUserLogin } from '../common/auth';

const logger = createDebugLogger(__filename);
interface User {
  id: number;
  name: string;
}

const userList: User[] = [
  {
    id: 1,
    name: 'KATT',
  },
];

const privateProcedure = t.procedure.use(requireUserLogin);

export const userRouter = t.router({
  getById: t.procedure
    .input(
      z.object({
        userId: z.number({ coerce: true }),
      }),
    )
    .query(({ input, ctx }) => {
      logger('input / session', input, ctx.session);
      logger('session.user', ctx.session?.user.id);
      const found = userList.find((user) => user.id === input.userId);
      if (!found) {
        throw new ClientBad('user not found', 'NOT_FOUND');
      }
      return found;
    }),
  getOwnProfile: privateProcedure.query(({ ctx }) => {
    return ctx.session!.user;
  }),
});
