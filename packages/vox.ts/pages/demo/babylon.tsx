import { FC } from 'react';
import { BabylonDemo } from '../../src/demo/babylon/babylon-demo';
import { DefaultMeta } from '../../src/components/meta/default-meta';

const BabylonDemoPage: FC = () => {
  return (
    <div>
      <DefaultMeta title="vox model rendered in Babylon.js" />
      <BabylonDemo />
    </div>
  );
};

export default BabylonDemoPage;
