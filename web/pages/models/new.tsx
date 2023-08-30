import { Layout } from '../../src/components/layout/layout';
import { useRef, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { BlockingContextProvider, useBlocking } from '../../src/hooks/use-blocking';
import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { useKeyGenerator } from '../../src/hooks/use-key-generator';
import { ModelFilePreview } from '../../src/components/vox-viewer/model-file-preview';
import { ModelFilePicker } from '../../src/components/vox-viewer/model-file-picker';

function CreateModelPageContent() {
  const [modelFile, setModelFile] = useState<null | ParsedVoxFile>(null);
  const flipCount = useKeyGenerator(modelFile);

  return (
    <div>
      {modelFile ? (
        <ModelFilePreview key={flipCount} voxFile={modelFile} onReset={() => setModelFile(null)} />
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
