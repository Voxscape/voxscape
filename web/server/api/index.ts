import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ClientBad } from './errors';
import { TrpcReqContext } from './auth';

const t = initTRPC.context<TrpcReqContext>().create();

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
    console.debug('input', input, ctx.session);
    const found = userList.find((user) => user.id === input.userId);
    if (!found) {
      throw new ClientBad('not found', 'NOT_FOUND');
    }
    return found;
  }),
});
