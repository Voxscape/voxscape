import { Layout } from '../../src/layout/layout';
import { useState } from 'react';
import { BlockingContextProvider, useBlocking } from '../../src/hooks/use-blocking';
import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { useKeyGenerator } from '../../src/hooks/use-key-generator';
import { ModelFilePicker } from '../../src/model/upload/model-file-picker';
import { ModelViewer } from '../../src/model/vox/model-viewer';
import { Button } from '@chakra-ui/react';
import { uploadVoxModel } from '../../src/model/upload/use-upload-model';
import { useModalApi } from '../../src/components/modal/modal-context';
import { useRouter } from 'next/router';
import { trpcClient } from '../../src/config/trpc';
import { ModelMetaForm, ModelMetaFormValue } from '../../src/model/upload/model-meta-field';
import { WithRequireLoginModal } from '../../src/hooks/use-require-login';

function CreateModelPageContent() {
  const [file, setFile] = useState<null | { f: File; parsed: ParsedVoxFile }>(null);
  const flipCount = useKeyGenerator(file);
  const [blocking, withBlocking] = useBlocking();
  const modalApi = useModalApi();
  const router = useRouter();

  const [formValue, setFormValue] = useState<ModelMetaFormValue>();

  const startUpload = withBlocking(async () => {
    if (!(file && formValue)) return;
    try {
      const uploaded = await uploadVoxModel(file.f);
      const saved = await trpcClient.models.vox.create.mutate({
        title: formValue.title,
        desc: formValue.desc,
        isPrivate: formValue.isPrivate,
        origFilename: file.f.name,
        assetUrl: uploaded.publicUrl,
        contentType: uploaded.contentType,
      });
      await modalApi.alert('Upload succeeded', `Model ID: ${saved.file.id}`);

      await router.push(`/models/vox/${saved.file.id}`);
    } catch (e: any) {
      await modalApi.alert('Upload failed', e?.message ?? '');
    }
  });

  return (
    <div>
      {file ? (
        <>
          <div className="flex justify-between">
            <Button disabled={blocking} onClick={() => setFile(null)}>
              Reset
            </Button>
            <Button color="primary" onClick={startUpload} disabled={blocking || !(file && formValue)}>
              Upload
            </Button>
          </div>
          <ModelMetaForm onChange={setFormValue} />
          <div className="mt-4">
            <h2>Preview:</h2>
            <ModelViewer key={flipCount} voxFile={file.parsed} />
          </div>
        </>
      ) : (
        <ModelFilePicker key={flipCount} onModelRead={(parsed, f) => setFile({ f, parsed })} />
      )}
    </div>
  );
}

export default function CreateModelPage() {
  return (
    <Layout>
      <WithRequireLoginModal>
        <BlockingContextProvider>
          <CreateModelPageContent />
        </BlockingContextProvider>
      </WithRequireLoginModal>
    </Layout>
  );
}
