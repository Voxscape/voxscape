import NextAuth from 'next-auth';
import type { NextApiHandler } from 'next';
import { nextAuthOptions } from '../../../server/next_auth';
import { withApiRequestLog } from '../../../server/request_logger';

const handler: NextApiHandler = (req, res) => NextAuth(req, res, nextAuthOptions);
export default withApiRequestLog(handler);
