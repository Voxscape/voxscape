import { GetServerSideProps, NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import React, { useCallback, useMemo } from 'react';
import { Button } from '@chakra-ui/react';
import { getServerSession, Session } from 'next-auth';
import { nextAuthOptions } from '../../server/next_auth';
import { Layout } from '../../src/components/layout/layout';

const Page: NextPage<{ session?: Session }> = (props) => {
  const signInGoogle = useCallback(() => signIn('google', {}), []);
  const signInDiscord = useCallback(() => signIn('discord', {}), []);
  const signInTwitter = useCallback(() => signIn('twitter', {}), []);

  const session = useSession();

  return (
    <Layout>
      <Button type="button" onClick={signInGoogle}>
        Sign in with Google
      </Button>
      <Button type="button" onClick={signInDiscord}>
        Sign in with Discord
      </Button>
      <Button type="button" onClick={signInTwitter}>
        Sign in with Twitter
      </Button>
    </Layout>
  );
};

/**
 * this allows first client render to see session (passed via <SessionContext> in _app.tsx)
 */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, nextAuthOptions);
  return { props: { session } };
};
export default Page;
