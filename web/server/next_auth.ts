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
  callbacks: {
    // rewrite session object (as seen by client/server)
    session({ session, user }) {
      return {
        expires: session.expires,
        user: {
          // hide name (often obtained from oauth) by default
          name: undefined,
          id: user.id,
          image: session.user?.image,
          email: session.user?.email,
        },
      };
    },
  },
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prisma),
};
