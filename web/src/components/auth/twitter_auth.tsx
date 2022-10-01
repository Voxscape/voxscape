import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { TwitterOAuth1Button, useOAuthCallback } from './auth_button';

export const TwitterAuthForm = () => {
  const router = useRouter();
  useEffect(() => {
    const query = router.query;
    console.debug('query', query);
    return () => {};
  }, [router]);
  useOAuthCallback();

  return (
    <div>
      <TwitterOAuth1Button />
    </div>
  );
};
