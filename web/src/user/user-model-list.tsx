import Link from 'next/link';
import { SafeUser } from '../../server/api/common/primitive';
import { TrpcResponseType } from '../config/trpc';

export function UserModelList(props: {
  user: SafeUser;
  voxModels: TrpcResponseType['user']['getById']['recentModels'];
}) {
  return (
    <div>
      <div>Recent models from {props.user.name ?? '(name unset)'}</div>
      <ol>
        {props.voxModels.map((model) => (
          <li key={model.id}>
            <Link href={`/models/vox/${model.id}`}>
              <div className="inline-block h-32 w-48 border mx-1 my-1 p-2">
                {model.id} / {model.title}
                <hr />
                {model.desc}
                <hr />
                {model.createdAt.toISOString()}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
