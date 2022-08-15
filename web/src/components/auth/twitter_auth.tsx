import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { TwitterOAuth1Button } from './auth_button';

export const TwitterAuthForm = () => {
  const router = useRouter();
  useEffect(() => {
    const query = router.query;
    console.debug('query', query);
    return () => {};
  }, []);

  return (
    <div>
      <TwitterOAuth1Button />
    </div>
  );
};
