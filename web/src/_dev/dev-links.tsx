import { FC } from 'react';
import Link from 'next/link';
import { useFps } from '@jokester/ts-commonutil/lib/react/hook/use-fps';

const devLinks = ['/users', '/models'];

export function FpsMeter() {
  const fps = useFps(60);
  return <div className="p-4 absolute right-0 bottom-0">{fps.toFixed(0)}FPS</div>;
}

export const DevLinks: FC = () => {
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
