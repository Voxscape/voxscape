import { isDevBuild } from '../../src/config/build-config';
import { FC } from 'react';
import Link from 'next/link';

export const DevLinks: FC = () => {
  if (!isDevBuild) {
    return null;
  }

  return (
    <div className="p-4 space-x-2">
      <span className="text-xl font-bold">DEV</span>
      <ul className="space-x-2 inline-block w-full">
        {['/users', '/models'].map((path) => (
          <li key={path} className="inline">
            <Link href={path}>{path}</Link>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};
