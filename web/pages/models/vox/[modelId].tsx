import { Layout } from '../../../src/layout/layout';
import { createDebugLogger } from '../../../shared/logger';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { trpcClient, useTrpcHooks } from '../../../src/config/trpc';
import { useVoxFile } from '../../../src/model/vox/use-vox-file';
import React from 'react';
import { DefaultMeta } from '../../../src/components/meta/default-meta';
import { ModelViewer } from '../../../src/model/vox/model-viewer';

const logger = createDebugLogger(__filename);

function VoxModelPageContent(props: { modelId: string }) {
  const trpcHooks = useTrpcHooks();
  const model = trpcHooks.models.vox.get.useQuery({ id: props.modelId });
  const modelFile = useVoxFile(model.data?.assetUrl);
  logger(props.modelId, model?.data, modelFile?.data);

  return (
    <div>
      Model ID: {props.modelId}
      <div>{modelFile?.data && <ModelViewer voxFile={modelFile.data} />}</div>
    </div>
  );
}
interface PageProps {
  modelId: string;
}

export default function VoxModelPage(props: PageProps) {
  return (
    <Layout>
      <DefaultMeta title={`Model ${props.modelId}`} />
      {props.modelId && <VoxModelPageContent modelId={props.modelId} />}
    </Layout>
  );
}

/**
 * @note this function is required to make the page server-side rendered
 * (or Page component will see isReady=false)
 */
export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  return { props: { modelId: ctx.query.modelId as string } };
};
