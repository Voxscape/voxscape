import { NextPage, NextPageContext } from 'next';
import { trpc } from '../../src/api/trpc';
import { useRouter } from 'next/router';

const UserDetailPage: NextPage = (props) => {
  const router = useRouter();
  const { userId } = router.query;
  const userQuery = trpc.userById.useQuery({ userId: (userId as string) ?? '' });

  console.debug('userQuery', userQuery);

  return <div>TODO</div>;
};

export default UserDetailPage;
