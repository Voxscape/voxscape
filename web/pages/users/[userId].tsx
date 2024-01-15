import { NextPage } from 'next';
import { trpcReact } from '../../src/config/trpc';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { TRPCClientError } from '@trpc/client';
import { Layout } from '../../src/layout/layout';
import { PageMeta } from '../../src/components/meta/page-meta';
import { createDebugLogger } from '../../shared/logger';
import { UserCard } from '../../src/user/user-card';
import { UserModelListHeader } from '../../src/user/user-model-list';
import { ModelListView } from '../../src/model/list/model-list.view';
import { signOut, useSession } from 'next-auth/react';
import { useModalApi } from '../../src/components/modal/modal-context';
import { Button } from '@chakra-ui/react';
import { IconLogout } from '@tabler/icons-react';
import { pixelFonts } from '../../src/styles/pixelBorders';
import clsx from 'clsx';

const logger = createDebugLogger(__filename);

const LogoutButton: FC = () => {
  const modal = useModalApi();
  const router = useRouter();

  const onLogout = async () => {
    const confirmed = await modal.confirm('Logout', 'Really?');
    if (confirmed.value) {
      signOut({ callbackUrl: '/' });
    }
  };

  return (
    <Button size="lg" className={clsx(pixelFonts.base, 'text-lg')} onClick={onLogout}>
      <IconLogout />
      <span className="ml-2">Logout</span>
    </Button>
  );
};

function UserDetailContent(props: { userId: string }) {
  const user = trpcReact.user.getById.useQuery({ userId: props.userId });
  const session = useSession();

  const selfView =
    session.data?.user?.id === props.userId ? (
      <>
        <section className="flex w-full justify-between items-center">
          <p>This is you!</p>
          <LogoutButton />
        </section>
        <hr className="my-4" />
      </>
    ) : null;

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
      {selfView}
      {user.data && (
        <>
          <section className="flex">
            <UserCard user={user.data.user} className="mx-auto" />
          </section>
          <section>
            <UserModelListHeader />
            <ModelListView voxModels={user.data.recentModels} />
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
