import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { usePromised } from '@jokester/ts-commonutil/lib/react/hook/use-promised';
import { useState, useMemo } from 'react';

export function PwaInstall3(props: unknown) {
  // @ts-ignore FIXME
  const f = useMemo(() => (inServer ? Never : import('@pwabuilder/pwainstall')), []);
  // @ts-ignore
  const p = usePromised(f);
  /* @ts-ignore */
  if (p.fulfilled) {
    /* @ts-ignore */
    return <pwa-install>INSTALL</pwa-install>;
  }
  return null;
}

export function PwaInstall(props: unknown) {
  const [loaded, setLoaded] = useState(false);
  useAsyncEffect(async (running) => {
    // @ts-ignore
    await import('@pwabuilder/pwainstall');
    if (running.current) {
      setLoaded(true);
    }
  }, []);

  if (!loaded) {
    return null;
  }
  /* @ts-ignore */
  return <pwa-install>INSTALL</pwa-install>;
}
