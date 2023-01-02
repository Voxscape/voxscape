import { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import React, { useCallback } from 'react';
import { Button } from '@chakra-ui/react';

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
export default Page;
