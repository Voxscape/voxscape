import { Layout } from '../../src/components/layout/layout';
import { ReactElement } from 'react';
import { useTrpcClient } from '../../src/config/trpc';
import Link from 'next/link';
import { datetimeFormatter } from '../../shared/date-formatter';

export default function UserIndexPage(): ReactElement {
  const trpcClient = useTrpcClient();
  const users = trpcClient.hook.user.list.useQuery({});

  const content =
    users.data &&
    users.data.users.map((u) => (
      <div key={u.id}>
        <Link href={`/users/${u.id}`}>
          {u.id} / created {datetimeFormatter.naturalTime(u.createdAt)}
        </Link>
      </div>
    ));

  return <Layout>Users: {content && <div>{content}</div>}</Layout>;
}
