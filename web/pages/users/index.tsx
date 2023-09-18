import { Layout } from '../../src/layout/layout';
import { ReactElement } from 'react';
import { trpcReact, useTrpcHooks } from '../../src/config/trpc';
import Link from 'next/link';
import { datetimeFormatter } from '../../shared/date-formatter';
import { buildSsrHandler } from '../../server/ssr';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';

export default function UserIndexPage(): ReactElement {
  const session = useSession();
  const trpcHooks = useTrpcHooks();
  const users = trpcHooks.user.list.useQuery({});

  const content =
    users.data &&
    users.data.users.map((u) => (
      <div key={u.id}>
        <Link href={`/users/${u.id}`} className={clsx({ 'font-bold': u.id === session.data?.user?.id })}>
          {u.id} / created {datetimeFormatter.naturalTime(u.createdAt)}
        </Link>
      </div>
    ));

  return <Layout>Users: {content && <div>{content}</div>}</Layout>;
}

export const getServerSideProps: GetServerSideProps = buildSsrHandler('session');
