import { Layout } from '../../src/layout/layout';
import { useState } from 'react';
import { BlockingContextProvider } from '../../src/hooks/use-blocking';
import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { useKeyGenerator } from '../../src/hooks/use-key-generator';
import { ModelFilePicker } from '../../src/model/model-file-picker';
import { ModelViewer } from '../../src/model/vox/model-viewer';

function CreateModelPageContent() {
  const [modelFile, setModelFile] = useState<null | ParsedVoxFile>(null);
  const flipCount = useKeyGenerator(modelFile);

  return (
    <div>
      {modelFile ? (
        <ModelViewer key={flipCount} voxFile={modelFile} onBack={() => setModelFile(null)} />
      ) : (
        <ModelFilePicker key={flipCount} onModelRead={setModelFile} />
      )}
    </div>
  );
}

export default function CreateModelPage() {
  return (
    <Layout>
      <BlockingContextProvider>
        <CreateModelPageContent />
      </BlockingContextProvider>
    </Layout>
  );
}
