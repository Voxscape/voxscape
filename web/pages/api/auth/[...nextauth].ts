import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { NextApiHandler } from 'next';
import SequelizeAdapter from '@next-auth/sequelize-adapter';
import { Sequelize } from 'sequelize';
import type { Adapter } from 'next-auth/adapters';

let initializedAdapter: null | Adapter = null;

function getAdapter(): undefined | Adapter {
  if (!process.env.NEXTAUTH_DB_URL) {
    return undefined;
  }

  console.info('configuring SequelizeAdapter');

  return (initializedAdapter ||= SequelizeAdapter(new Sequelize(process.env.NEXTAUTH_DB_URL), {}));
}

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  adapter: getAdapter(),
};

const handler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export default handler;
