import { useTrpcHooks } from '../../config/trpc';
import { QueryResult } from '../../components/hoc/query-result';
import { ModelListView } from './model-list.view';

export function IndexPageModelList() {
  const trpcHooks = useTrpcHooks();
  const models = trpcHooks.models.recent.useQuery({});

  return <QueryResult value={models}>{(models) => <ModelListView voxModels={models.voxModels} />}</QueryResult>;
}
