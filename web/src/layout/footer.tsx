import { chakra } from '@chakra-ui/react';
import Link from 'next/link';
import type { ReactElement } from 'react';

export function LayoutFooter(): ReactElement {
  return (
    <div className="mx-auto space-x-4 pb-2 text-xs">
      <hr className="my-2" />
      <Link href="/web/pages/about">About</Link>
      <Link href="/web/pages/user_agreement">User Agreement</Link>
      <Link href="/web/pages/privacy_policy">Privacy Policy</Link>
    </div>
  );
}
