import { Layout } from '../../src/layout/layout';
import { useTrpcHooks } from '../../src/config/trpc';
import { QueryResult } from '../../src/components/hoc/query-result';
import { ModelList } from '../../src/model/list/model-list';

function ModelListPageContent() {
  const trpcHooks = useTrpcHooks();
  const models = trpcHooks.models.recent.useQuery({});

  const modelsView = <QueryResult value={models}>{(models) => <ModelList voxModels={models.voxModels} />}</QueryResult>;

  return <div>{modelsView}</div>;
}

export default function ModelListPage() {
  return (
    <Layout>
      <ModelListPageContent />
    </Layout>
  );
}
