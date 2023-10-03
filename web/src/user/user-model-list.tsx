import Link from 'next/link';
import { SafeUser } from '../../server/api/common/primitive';
import { TrpcResponseType } from '../config/trpc';
import { ModelList } from '../model/list/model-list';

export function UserModelList(props: { voxModels: TrpcResponseType['user']['getById']['recentModels'] }) {
  return (
    <div>
      <h5 className="text-center mt-4">Recent models</h5>
      <ModelList voxModels={props.voxModels} />
    </div>
  );
}
