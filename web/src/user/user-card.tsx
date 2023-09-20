import { FC } from 'react';
import type { SafeUser } from '../../server/api/common/primitive';

export const UserCard: FC<{ user: SafeUser }> = (props) => {
  return (
    <div>
      <p>{props.user.name ?? '(name unset)'}</p>
    </div>
  );
};
