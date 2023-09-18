import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { useModalApi } from '../../components/modal/modal-context';
import { useToast } from '@chakra-ui/react';
import { useBlocking } from '../../hooks/use-blocking';
import { readBlob } from '@jokester/ts-commonutil/lib/binary-conversion/web';
import { basicParser } from '@voxscape/vox.ts/src/parser/basic-parser';
import { FileInput } from '@mantine/core';
import { IconFileUpload } from '@tabler/icons-react';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';

export function ModelFilePicker(props: { onModelRead?(voxFile: ParsedVoxFile, raw: File): void }) {
  const modal = useModalApi();
  const toast = useToast();
  const [blocking, inBlocking] = useBlocking();
  const onStartRead = inBlocking(async (f: File | null) => {
    if (!f) return;

    const bytes = await readBlob(f);
    const parsed = basicParser(bytes);

    if (parsed.warnings.length) {
      const confirmResult = await modal.confirm(
        'Unsupported .vox extension detected',
        <>
          <p>You can still proceed to preview and upload the file.</p>
          {/*
          <p>When .vox render gets improved in future, uploaded files will behave correctly.</p>
             */}
          <hr />
          <pre>{parsed.warnings.join('\n')}</pre>
        </>,
        { confirmButtonText: 'Proceed' },
      );
      if (!confirmResult.value) {
        return;
      }
    }
    await wait(0.5e3); // to pretend we are doing something
    toast({
      id: `model-uploaded`,
      title: `${f.name} loaded`,
      status: 'success',
    });

    props.onModelRead?.(parsed, f);
  });
  return (
    <FileInput
      className="w-64 mx-auto"
      icon={<IconFileUpload />}
      label="Please select a .vox file."
      accept=".vox"
      disabled={blocking}
      onChange={onStartRead}
    />
  );
}
