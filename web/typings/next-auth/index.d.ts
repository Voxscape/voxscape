import NextAuth, { DefaultSession } from 'next-auth';
declare module 'next-auth' {
  export interface Session extends DefaultSession {
    user?: DefaultSession['user'] & { id: string };
  }
}
