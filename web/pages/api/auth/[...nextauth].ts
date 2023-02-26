import NextAuth from 'next-auth';
import type { NextApiHandler } from 'next';
import { nextAuthOptions } from '../../../server/next_auth';

const handler: NextApiHandler = (req, res) => NextAuth(req, res, nextAuthOptions);
export default handler;
