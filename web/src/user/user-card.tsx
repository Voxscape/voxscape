import { FC } from 'react';
import type { SafeUser } from '../../server/api/common/primitive';

export const UserCard: FC<{ user: SafeUser }> = (props) => {
  return (
    <div className="inline-block border w-64 h-48">
      <p>{props.user.name ?? '(name unset)'}</p>
      <img alt="avatar" src={props.user.image} className="w-32 h-32" />
    </div>
  );
};
