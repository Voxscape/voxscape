import { NextPage, NextPageContext } from 'next';
import { trpcReact } from '../../src/config/trpc';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { TRPCClientError } from '@trpc/client';
import { Layout } from '../../src/components/layout/layout';
import { PageMeta } from '../../src/components/meta/page-meta';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@chakra-ui/react';
import { IconLogout } from '@tabler/icons-react';
import { userRouter } from '../../server/api/routes/user';

function UserDetailContent(props: { userId: string }) {
  const userQuery = trpcReact.user.getById.useQuery({ userId: props.userId });

  console.debug('userQuery', userQuery.isLoading, userQuery.status, userQuery.data, userQuery.error);

  useEffect(() => {
    if (userQuery.error instanceof TRPCClientError) {
      console.error('userQuery.error.message', userQuery.error.message);
      console.debug('userQuery.error', userQuery.error);
    } else {
      console.debug('userQuery.data', userQuery.data);
    }
  }, [userQuery.error]);

  return (
    <>
      <PageMeta title="User" />
      <div className="whitespace-pre-line break-inside-auto font-mono">{JSON.stringify(userQuery.data, null, 2)}</div>
    </>
  );
}

function UserSelfContent(props: { userId: string }) {
  const session = useSession();
  const router = useRouter();
  if (session.status === 'authenticated' && session.data.user?.id === props.userId) {
    const onLogout = () => {
      signOut().then(() => {
        router.reload();
      });
    };
    return (
      <div>
        <div className="my-4">TODO: settings</div>
        <div className="my-4">
          LOGOUT:
          <Button onClick={onLogout}>
            <IconLogout />
          </Button>
        </div>
      </div>
    );
  }
  return null;
}

const UserDetailPage: NextPage = (props) => {
  const router = useRouter();
  const { userId } = router.query;

  if (router.isReady && typeof userId === 'string') {
    return (
      <Layout key={userId}>
        <UserDetailContent userId={userId} />
        <UserSelfContent userId={userId} />
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
