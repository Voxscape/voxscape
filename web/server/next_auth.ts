/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import Discord from 'next-auth/providers/discord';

export const nextAuthOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      httpOptions: { timeout: 10e3 },
    }),
    Discord({
      clientId: process.env.DISCORD_OAUTH_CLIENT_ID!,
      clientSecret: process.env.DISCORD_OAUTH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // rewrite session object (as seen by client/server)
    session({ session, user }) {
      return {
        expires: session.expires,
        user: {
          // hide name (often obtained from oauth) by default
          name: null,
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
