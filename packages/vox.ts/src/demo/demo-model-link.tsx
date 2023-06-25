import Link from 'next/link';
import { RefModelIndexEntry } from './demo-model-list/ref-models';
import { ReactElement } from 'react';

export function DemoModelLink({ entry, index }: { entry: RefModelIndexEntry; index: number }): ReactElement {
  const href = `/demo-models/show?file=${encodeURIComponent(entry.path.replaceAll(/^\.\//g, ''))}&modelIndex=${index}`;

  return (
    <Link href={href} target="_blank">
      Open
    </Link>
  );
}
