import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';
import { BabylonDemo, ModelPath } from '../../src/demo/demo-models-show/demo-models';

const BabylonViewerPage: FC = () => {
  const router = useRouter();
  const query = router.query as { file: string; modelIndex: string; builder?: string };

  const initialPath: undefined | ModelPath = useMemo(() => {
    if (router.isReady && query.file) {
      return {
        modelUrl: query.file,
        modelIndex: ~~query.modelIndex || 0,
      };
    }
    return undefined;
  }, [router.isReady, query.file, query.modelIndex]);

  if (initialPath) {
    console.debug('initialPath', initialPath);
  }

  return (
    <div>
      {initialPath && (
        <BabylonDemo key={`${initialPath.modelUrl}-${initialPath.modelIndex}}`} initialPath={initialPath} />
      )}
    </div>
  );
};

export default BabylonViewerPage;
