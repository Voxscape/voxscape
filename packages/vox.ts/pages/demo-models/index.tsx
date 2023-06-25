import { DemoModelList } from '../../src/demo/demo-model-list/demo-models';
import React from 'react';
import { RefModelList } from '../../src/demo/babylon/babylon-demo';

const DemoModelsPage: React.FC = () => {
  return (
    <div>
      <RefModelList />
      <hr className="my-2" />
      <DemoModelList />
    </div>
  );
};

export default DemoModelsPage;
