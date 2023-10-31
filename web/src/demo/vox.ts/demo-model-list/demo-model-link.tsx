import Link from 'next/link';
import { RefModelIndexEntry } from './ref-models';
import { PropsWithChildren, ReactElement } from 'react';
import { Button } from '@chakra-ui/react';

export function DemoModelLink({ entry, children }: PropsWithChildren<{ entry: RefModelIndexEntry }>): ReactElement {
  const href = `/demo/vox.ts/show?file=${encodeURIComponent(entry.downloadPath.replaceAll(/^\.\//g, ''))}`;

  return (
    <Link href={href} target="_blank">
      <Button>{children}</Button>
    </Link>
  );
}
