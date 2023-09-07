import React from 'react';
import { DemoModelList } from '../../../src/demo/vox.ts/demo-model-list/demo-models';

const DemoModelsPage: React.FC = () => {
  return (
    <div>
      <hr className="my-2" />
      <DemoModelList />
    </div>
  );
};

export default DemoModelsPage;
