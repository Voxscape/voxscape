import { useRouter } from 'next/router';
import { BabylonDemo, ModelPath } from '../../src/demo/babylon/babylon-demo';
import { useMemo } from 'react';

const BabylonViewerPage: React.FC = () => {
  const router = useRouter();
  const query = router.query as { file: string; modelIndex: string };

  const initialPath: undefined | ModelPath = useMemo(() => {
    if (query.file) {
      return {
        modelUrl: query.file,
        modelIndex: ~~query.modelIndex || 0,
      };
    }
    return undefined;
  }, [query.file, query.modelIndex]);

  console.debug('initialPath', initialPath);

  return (
    <div>
      <BabylonDemo initialPath={initialPath} />
    </div>
  );
};

export default BabylonViewerPage;
