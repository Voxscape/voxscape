import Link from 'next/link';
import { RefModelIndexEntry } from './ref-models';
import { ReactElement } from 'react';

export function DemoModelLink({ entry, index }: { entry: RefModelIndexEntry; index: number }): ReactElement {
  const href = `/demo/vox.ts/show?file=${encodeURIComponent(entry.path.replaceAll(/^\.\//g, ''))}&modelIndex=${index}`;

  return (
    <Link href={href} target="_blank">
      Open
    </Link>
  );
}
