import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ClientBad } from './errors';

const t = initTRPC.create();

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
  userById: t.procedure
    .input((val) => GetUserRequest.parse(val))
    .query(({ input, ctx }) => {
      console.debug('input', input);
      const found = userList.find((user) => user.id === input.userId);
      if (!found) {
        throw new ClientBad('not found', 'NOT_FOUND');
      }
      return found;
    }),
});
