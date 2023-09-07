import { Layout } from '../../src/layout/layout';
import { useTrpcClient } from '../../src/config/trpc';
import { Spinner } from '@chakra-ui/react';

function ModelListPageContent() {
  const client = useTrpcClient();
  const models = client.hook.models.recent.useQuery();

  if (!models.data?.models) {
    return <Spinner />;
  }

  return (
    <ul>
      {models.data.models.map((m) => (
        <li key={m.id}>{m.id}</li>
      ))}
    </ul>
  );
}

export default function ModelListPage() {
  return (
    <Layout>
      <ModelListPageContent />
    </Layout>
  );
}
