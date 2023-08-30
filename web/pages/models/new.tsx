import { Layout } from '../../src/components/layout/layout';
import { useTrpcClient } from '../../src/config/trpc';
import { useModalApi } from '../../src/components/modal/modal-context';
import { useRef } from 'react';
import { Button } from '@chakra-ui/react';
import { useBlocking } from '../../src/hooks/use-blocking';

function CreateModelPageContent() {
  const fileRef = useRef<HTMLInputElement>(null!);

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
