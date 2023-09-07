import { PropsWithChildren, useEffect, useState } from 'react';
import { isDevBuild } from '../config/build-config';

export function OnlyInDev(props: PropsWithChildren) {
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (isDevBuild) {
      setRender(true);
    }
  }, []);

  return render ? props.children : null;
}
