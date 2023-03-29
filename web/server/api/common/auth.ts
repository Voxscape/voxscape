import { getServerSession, Session } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { nextAuthOptions } from '../../next_auth';
import { t } from './_base';
import { ClientBad } from '../errors';

export interface TrpcReqContext {
  session?: Session & {
    user: {
      id: string;
    };
  };
}

interface AssertedReqContext {
  session: NonNullable<TrpcReqContext['session']>;
}

/**
 * expose next-auth session to trpc
 */
export async function createTrpcReqContext(req: NextApiRequest, res: NextApiResponse): Promise<TrpcReqContext> {
  return {
    session: (await getServerSession(req, res, nextAuthOptions)) || undefined,
  };
}

export const requireUserLogin = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new ClientBad(`not logged in`, `UNAUTHORIZED`);
  }
  return next({ ctx: ctx as AssertedReqContext });
});
