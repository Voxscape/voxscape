import { getServerSession, Session } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { nextAuthOptions } from '../next_auth';

export interface TrpcReqContext {
  session?: Session;
}

/**
 * expose next-auth session to trpc
 */
export async function createTrpcReqContext(req: NextApiRequest, res: NextApiResponse): Promise<TrpcReqContext> {
  return {
    session: (await getServerSession(req, res, nextAuthOptions)) || undefined,
  };
}
