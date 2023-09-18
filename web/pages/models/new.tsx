import { Layout } from '../../src/layout/layout';
import { useState } from 'react';
import { BlockingContextProvider, useBlocking } from '../../src/hooks/use-blocking';
import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { useKeyGenerator } from '../../src/hooks/use-key-generator';
import { ModelFilePicker } from '../../src/model/upload/model-file-picker';
import { ModelViewer } from '../../src/model/vox/model-viewer';
import { Button } from '@chakra-ui/react';
import { createVoxModel, uploadVoxModel } from '../../src/model/upload/use-upload-model';
import { useModalApi } from '../../src/components/modal/modal-context';
import { useRouter } from 'next/router';

function CreateModelPageContent() {
  const [value, setValue] = useState<null | { f: File; parsed: ParsedVoxFile }>(null);
  const flipCount = useKeyGenerator(value);
  const [blocking, withBlocking] = useBlocking();
  const modalApi = useModalApi();
  const router = useRouter();

  const startUpload = withBlocking(async () => {
    if (!value) return;
    try {
      const uploaded = await uploadVoxModel(value.f);
      const saved = await createVoxModel(uploaded.publicUrl, uploaded.contentType, false);
      await modalApi.alert('Upload succeeded', `Model ID: ${saved.file.id}`);

      await router.push(`/models/vox/${saved.file.id}`);
    } catch (e: any) {
      await modalApi.alert('Upload failed', e?.message ?? '');
    }
  });

  return (
    <div>
      {value ? (
        <>
          <div className="flex justify-between">
            <Button disabled={blocking} onClick={() => setValue(null)}>
              Reset
            </Button>
            <Button color="primary" onClick={startUpload} disabled={!value || blocking}>
              Upload
            </Button>
          </div>
          <div className="mt-4">
            <ModelViewer key={flipCount} voxFile={value.parsed} />
          </div>
        </>
      ) : (
        <ModelFilePicker key={flipCount} onModelRead={(parsed, f) => setValue({ f, parsed })} />
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
