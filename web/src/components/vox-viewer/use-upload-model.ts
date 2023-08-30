import { useBlocking } from '../../hooks/use-blocking';
import { useTrpcClient } from '../../config/trpc';
import { useModalApi } from '../modal/modal-context';

export function useModelUpload() {
  const api = useTrpcClient();
  const modal = useModalApi();

  const [blocking, inBlocking] = useBlocking();

  const uploadModel = inBlocking(async (f: File) => {
    try {
      const uploadUrl = await api.$.models.requestUpload.mutate({ filename: f.name, contentType: f.type });

      const uploaded = await fetch(uploadUrl.uploadUrl, {
        method: 'PUT',
        body: f,
        headers: {
          'Content-Disposition': encodeURIComponent(f.name),
        },
      });
      if (!uploaded.ok) {
        throw new Error(uploaded.statusText);
      }
      await modal.alert('uploaded', uploadUrl.publicUrl);
    } catch (e: any) {
      await modal.alert(`???`, e.message);
    }
  });
}
