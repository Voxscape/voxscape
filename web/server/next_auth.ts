import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';

export const nextAuthOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      httpOptions: { timeout: 10e3 },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prisma),
};
