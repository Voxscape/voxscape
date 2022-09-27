import { useRouter } from 'next/router';
import { BabylonDemo } from '../../src/demo/babylon/babylon-demo';

const BabylonViewerPage: React.FC = () => {
  const router = useRouter();
  const query = router.query as { file: string; modelId: string };

  return (
    <div>
      <BabylonDemo path={query} />
    </div>
  );
};

export default BabylonViewerPage;
