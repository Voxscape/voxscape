import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ModelListPage() {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      router.replace('/');
    }
  }, [router, router.isReady]);
  return null;
}
