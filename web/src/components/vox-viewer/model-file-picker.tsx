import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { useModalApi } from '../modal/modal-context';
import { Input, useToast } from '@chakra-ui/react';
import { useBlocking } from '../../hooks/use-blocking';
import { ChangeEvent, useState } from 'react';
import { readBlob } from '@jokester/ts-commonutil/lib/binary-conversion/web';
import { basicParser } from '@voxscape/vox.ts/src/parser/basic-parser';
import { FileInput } from '@mantine/core';
import { IconFileUpload } from '@tabler/icons-react';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';

export function ModelFilePicker(props: { onModelRead?(voxFile: ParsedVoxFile): void }) {
  const modal = useModalApi();
  const toast = useToast();
  const [blocking, inBlocking] = useBlocking();
  const onStartRead = inBlocking(async (f: File | null) => {
    if (!f) return;

    const bytes = await readBlob(f);
    const parsed = basicParser(bytes);

    if (parsed.warnings.length) {
      const proceed = await modal.confirm(
        'File loaded with warnings',
        <>
          <p>Not all .vox extensions are supported. You can still continue to preview and upload the file.</p>
          <pre>{parsed.warnings.join('\n')}</pre>
        </>,
      );
      if (!proceed) {
        return;
      }
    }
    await wait(5e3);
    toast({
      title: 'File loaded',
    });

    props.onModelRead?.(parsed);
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
