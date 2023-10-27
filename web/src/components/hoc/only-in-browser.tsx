import { PropsWithChildren, useEffect, useState } from 'react';

export function OnlyInBrowser(props: PropsWithChildren<{}>) {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  return isBrowser ? props.children : null;
}
