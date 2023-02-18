import { GetServerSideProps, NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import React, { useCallback } from 'react';
import { Button } from '@chakra-ui/react';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../../src/server/next_auth';

const Page: NextPage = () => {
  const signInGoogle = useCallback(() => signIn('google', {}), []);

  const session = useSession();

  console.debug('session', session);

  return (
    <div>
      <Button type="button" onClick={signInGoogle}>
        Sign in with Google
      </Button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, nextAuthOptions);
  console.debug('server session', session);
  return { props: {} };
};
export default Page;
