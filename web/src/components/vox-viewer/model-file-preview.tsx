import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { Button } from '@chakra-ui/react';

export function ModelFilePreview(props: { voxFile: ParsedVoxFile; onReset?(): void }) {
  return (
    <div>
      <Button onClick={props.onReset}>Back</Button>
    </div>
  );
}
