import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { useModalApi } from '../modal/modal-context';
import { Input, useToast } from '@chakra-ui/react';
import { useBlocking } from '../../hooks/use-blocking';
import { ChangeEvent } from 'react';
import { readBlob } from '@jokester/ts-commonutil/lib/binary-conversion/web';
import { basicParser } from '@voxscape/vox.ts/src/parser/basic-parser';

export function ModelFilePicker(props: { onModelRead?(voxFile: ParsedVoxFile): void }) {
  const modal = useModalApi();
  const toast = useToast();
  const [blocking, inBlocking] = useBlocking();
  const onChange = inBlocking(async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const bytes = await readBlob(f);
    const parsed = basicParser(bytes);

    if (parsed.warnings.length) {
      const proceed = await modal.confirm(
        'File loaded with warnings',
        <>
          <p>Do you wish to continue?"</p>
          <pre>{parsed.warnings.join('\n')}</pre>
        </>,
      );
      if (!proceed) {
        return;
      }
    }
    toast({
      title: 'File loaded',
    });

    props.onModelRead?.(parsed);
  });
  return <Input type="file" accept=".vox" disabled={blocking} onChange={onChange} />;
}
