import { NextPage } from 'next';
import { trpcReact } from '../../src/config/trpc';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { TRPCClientError } from '@trpc/client';
import { Layout } from '../../src/layout/layout';
import { PageMeta } from '../../src/components/meta/page-meta';
import { createDebugLogger } from '../../shared/logger';
import { UserCard } from '../../src/user/user-card';
import { UserModelListHeader } from '../../src/user/user-model-list';
import { ModelList } from '../../src/model/list/model-list';

const logger = createDebugLogger(__filename);

function UserDetailContent(props: { userId: string }) {
  const user = trpcReact.user.getById.useQuery({ userId: props.userId });

  useEffect(() => {
    if (user.error instanceof TRPCClientError) {
      logger('user.error.message', user.error.message);
      logger('user.error', user.error);
    } else {
      logger('user.data', user.data);
    }
  }, [user.error]);

  return (
    <>
      <PageMeta title="User" />
      {user.data && (
        <>
          <section className="flex">
            <UserCard user={user.data.user} className="mx-auto" />
          </section>
          <section>
            <UserModelListHeader />
            <ModelList voxModels={user.data.recentModels} />
          </section>
        </>
      )}
    </>
  );
}

const UserDetailPage: NextPage = (props) => {
  const router = useRouter();
  const { userId } = router.query;

  if (router.isReady && typeof userId === 'string') {
    return (
      <Layout key={userId}>
        <UserDetailContent userId={userId} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-center">loading...</div>
    </Layout>
  );
};

export default UserDetailPage;
