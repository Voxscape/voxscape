import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/api';
import { ZodError } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTrpcReqContext } from '../../../server/api/auth';
// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: async (ctx) => createTrpcReqContext(ctx.req, ctx.res),
  onError({ error, type, path, input, ctx, req }) {
    console.debug('error', error, type, path, ctx);
    if (error.cause instanceof ZodError) {
      // we could rewrite error code / message here
      throw new TRPCError({ message: `zod error`, code: 'BAD_REQUEST' });
    }
  },
  batching: {
    enabled: true,
  },
});
