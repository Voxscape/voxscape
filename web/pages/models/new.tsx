import { Layout } from '../../src/components/layout/layout';
import { useTrpcClient } from '../../src/config/trpc';
import { useModalApi } from '../../src/components/modal/modal-context';
import { useRef } from 'react';
import { Button } from '@chakra-ui/react';
import { useBlocking } from '../../src/hooks/use-blocking';

function CreateModelPageContent() {
  const api = useTrpcClient();
  const modal = useModalApi();

  const fileRef = useRef<HTMLInputElement>(null!);
  const [blocking, inBlocking] = useBlocking();

  const onUpload = inBlocking(async () => {
    const f = fileRef.current.files?.[0];
    if (!f) return;
    try {
      const uploadUrl = await api.$.models.requestUpload.mutate({ filename: 'wtf.vox', contentType: 'wtf' });

      const uploaded = await fetch(uploadUrl.url, {
        method: 'PUT',
        body: f,
      });
    } catch (e: any) {
      await modal.alert(`???`, e.message);
    }
  });

  return (
    <div>
      <input type="file" ref={fileRef} />
      <Button type="button" onClick={onUpload}>
        Upload
      </Button>
    </div>
  );
}

export default function CreateModelPage() {
  return (
    <Layout>
      <CreateModelPageContent />
    </Layout>
  );
}
