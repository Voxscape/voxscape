import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';
import { BabylonDemo, ModelPath } from '../../../src/demo/vox.ts/demo-models-show/demo-models';

const BabylonViewerPage: FC = () => {
  const router = useRouter();
  const query = router.query as { file: string };

  const initialPath: undefined | ModelPath = useMemo(() => {
    if (router.isReady && query.file) {
      return {
        modelUrl: query.file,
      };
    }
    return undefined;
  }, [router.isReady, query.file]);

  if (initialPath) {
    console.debug('initialPath', initialPath);
  }

  return <div>{initialPath && <BabylonDemo key={initialPath.modelUrl} initialPath={initialPath} />}</div>;
};

export default BabylonViewerPage;
