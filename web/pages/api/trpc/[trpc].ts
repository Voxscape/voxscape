import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/api';
import { ZodError } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTrpcReqContext } from '../../../server/api/common/auth';
import { createDebugLogger } from '../../../shared/logger';
const logger = createDebugLogger(__filename);
// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
  router: appRouter,

  createContext: (ctx) => createTrpcReqContext(ctx.req, ctx.res),

  responseMeta({ ctx, errors, paths, type }) {
    const dangerousToCache =
      ctx?.session || errors.length || paths?.some((path) => path.includes('user') || type !== 'query');

    if (dangerousToCache) {
      return {
        headers: {
          'cache-control': 'no-cache',
        },
      };
    }
    return {};
  },

  onError({ error, type, path, input, ctx, req }) {
    logger('error', error, type, path, ctx);
    if (error.cause instanceof ZodError) {
      // we could rewrite error code / message here
      throw new TRPCError({ message: `zod error`, code: 'BAD_REQUEST' });
    }
  },

  batching: {
    enabled: true,
  },
});
