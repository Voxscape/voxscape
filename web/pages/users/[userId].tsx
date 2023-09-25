import { NextPage } from 'next';
import { trpcReact } from '../../src/config/trpc';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { TRPCClientError } from '@trpc/client';
import { Layout } from '../../src/layout/layout';
import { PageMeta } from '../../src/components/meta/page-meta';
import { createDebugLogger } from '../../shared/logger';
import { UserCard } from '../../src/user/user-card';
import { UserModelList } from '../../src/user/user-model-list';
import { UserSettings } from '../../src/user/user-setting';

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
          <div>
            <UserCard user={user.data.user} />
          </div>
          <UserModelList user={user.data.user} voxModels={user.data.recentModels} />
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
        <UserSettings userId={userId} />
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
