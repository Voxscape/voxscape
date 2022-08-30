import { FC } from 'react';
import { BabylonDemo } from '../../src/demo/babylon/babylon-demo';
import { DefaultMeta } from '../../src/demo/components/default-meta';

const BabylonDemoPage: FC = () => {
  return (
    <div>
      <DefaultMeta />
      <BabylonDemo />
    </div>
  );
};

export default BabylonDemoPage;
