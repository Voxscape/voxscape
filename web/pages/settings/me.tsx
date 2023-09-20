import { FC, useEffect } from 'react';
import { useTrpcHooks } from '../../src/config/trpc';
import { createDebugLogger } from '../../shared/logger';

const logger = createDebugLogger(__filename);

const ProfilePage: FC = () => {
  const trpcHooks = useTrpcHooks();
  const self = trpcHooks.user.getOwnProfile.useQuery();
  useEffect(() => {
    logger('self', self);
  }, [self]);
  return <div>TODO</div>;
};

export default ProfilePage;
