import { isDevBuild } from '../../src/config/build-config';
import { FC } from 'react';
import Link from 'next/link';
const devLinks = ['/users', '/models'];

export const DevLinks: FC = () => {
  if (!isDevBuild) {
    return null;
  }

  return (
    <div className="p-4 space-x-2 absolute left-0 bottom-0">
      <span className="text-xl font-bold">DEV LINKS</span>
      <ul className="">
        {devLinks.map((path) => (
          <li key={path} className="block">
            <Link className="w-full" href={path}>
              {path}
            </Link>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export default DevLinks;
