import { FC, useEffect } from 'react';
import { useTrpcClient } from '../../src/config/trpc';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { createDebugLogger } from '../../shared/logger';

const logger = createDebugLogger(__filename);

const ProfilePage: FC = () => {
  const trpcClient = useTrpcClient();
  useAsyncEffect(async (running) => {
    if (!running.current) return;
    const f = await trpcClient.$.user.getOwnProfile.query().then(
      (u) => logger('user', u),
      (e) => logger('error', e),
    );
  }, []);
  return <div>TODO</div>;
};

export default ProfilePage;
