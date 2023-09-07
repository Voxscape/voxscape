import { DemoModelList } from '@voxscape/vox.ts/src/demo/demo-model-list/demo-models';
import React from 'react';

const DemoModelsPage: React.FC = () => {
  return (
    <div>
      <hr className="my-2" />
      <DemoModelList />
    </div>
  );
};

export default DemoModelsPage;
