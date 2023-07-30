import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/api';
import { ZodError } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTrpcReqContext } from '../../../server/api/common/session.middleware';
import { createDebugLogger } from '../../../shared/logger';
import { ClientBad } from '../../../server/api/errors';
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
    if (error.cause instanceof ZodError) {
      // we could rewrite error code / message here
      throw new TRPCError({ message: `zod error`, code: 'BAD_REQUEST' });
    } else if (error instanceof ClientBad) {
      logger('client bad', path, input, ctx);
    } else {
      logger('error', error, type, path, ctx);
    }
  },

  batching: {
    enabled: true,
  },
});
