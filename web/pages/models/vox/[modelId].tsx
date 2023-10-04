import { Layout } from '../../../src/layout/layout';
import { createDebugLogger } from '../../../shared/logger';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { trpcClient, useTrpcHooks } from '../../../src/config/trpc';
import { useVoxFile } from '../../../src/model/vox/use-vox-file';
import React from 'react';
import { ModelViewer } from '../../../src/model/vox/model-viewer';
import { PageMeta } from '../../../src/components/meta/page-meta';
import { useRenderTrpcQuery } from '../../../src/hooks/render-trpc-response';
import { UserCard, UserNameplate } from '../../../src/user/user-card';
import Link from 'next/link';
import { pixelBorders, pixelFonts } from '../../../src/styles/pixelBorders';

const logger = createDebugLogger(__filename);

function VoxModelPageContent(props: { modelId: string }) {
  const trpcHooks = useTrpcHooks();
  const model = trpcHooks.models.vox.get.useQuery({ id: props.modelId });
  const modelFile = useVoxFile(model.data?.assetUrl);
  logger(props.modelId, model?.data, modelFile?.data);

  const modelMetaView = useRenderTrpcQuery(model, (m) => (
    <>
      {m.title}
      <br />
      {m.desc}
      <br />
      {m.origFilename}
    </>
  ));
  const pageMetaView = useRenderTrpcQuery(model, (m) => <PageMeta title={m.title} desc={m.desc} />);

  const ownerUserView = useRenderTrpcQuery(model, (m) => (
    <div className="text-right">
      <span className={pixelFonts.base}>Uploaded by</span>
      <Link href={`/users/${m.ownerUser.id}`} className="ml-2">
        <UserNameplate user={m.ownerUser} size="xs" />
      </Link>
    </div>
  ));

  return (
    <div>
      {pageMetaView}
      <div>{modelFile?.data && <ModelViewer voxFile={modelFile.data} />}</div>
      <hr className={'my-4'} />
      <div>{ownerUserView}</div>
    </div>
  );
}
interface PageProps {
  modelId: string;
}

export default function VoxModelPage(props: PageProps) {
  return (
    <Layout>
      <PageMeta title={`Model ${props.modelId}`} />
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
