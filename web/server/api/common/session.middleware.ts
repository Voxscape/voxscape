import { getServerSession, Session } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { nextAuthOptions } from '../../next_auth';
import { t } from './_base';
import { ClientBad } from '../errors';
import { isFuture, parseISO } from 'date-fns';
import { createDebugLogger } from '../../../shared/logger';
const debug = createDebugLogger(__filename);

export interface TrpcReqContext {
  reqId: string;
  session?: Session & {
    user: {
      id: string;
    };
  };
}

interface AssertedReqContext extends TrpcReqContext {
  session: NonNullable<TrpcReqContext['session']>;
}

/**
 * expose next-auth session to trpc
 */
export async function createTrpcReqContext(req: NextApiRequest, res: NextApiResponse): Promise<TrpcReqContext> {
  return {
    reqId: (req as any).reqId ?? `undefined`,
    session: (await getServerSession(req, res, nextAuthOptions)) || undefined,
  };
}

export const requireUserLogin = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new ClientBad(`not logged in`, `UNAUTHORIZED`);
  }
  if (!(typeof ctx.session.expires === 'string' && isFuture(parseISO(ctx.session.expires)))) {
    throw new ClientBad(`session expired`, `UNAUTHORIZED`);
  }
  debug('session', ctx.session);
  return next({ ctx: ctx as AssertedReqContext });
});
