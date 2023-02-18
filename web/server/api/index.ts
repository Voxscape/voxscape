import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ClientBad } from './errors';
import { TrpcReqContext } from './auth';
import { createServerLogger } from '../logger';

const t = initTRPC.context<TrpcReqContext>().create();

const logger = createServerLogger(__filename);

const publicProcedure = t.procedure;

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

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

const GetUserRequest = z.object({
  userId: z.number({ coerce: true }),
});

export const appRouter = t.router({
  userById: t.procedure.input(GetUserRequest).query(({ input, ctx }) => {
    logger('input / session', input, ctx.session);
    logger('session.user', ctx.session?.user.id);
    const found = userList.find((user) => user.id === input.userId);
    if (!found) {
      throw new ClientBad('not found', 'NOT_FOUND');
    }
    return found;
  }),
});
