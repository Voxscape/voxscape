import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const TwitterAuthForm = () => {
  const router = useRouter();
  useEffect(() => {
    const query = router.query;
    console.debug('query', query);
    return () => {};
  }, []);

  return <div>TODO</div>;
};
