import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { Button, useCounter } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useVoxViewer } from './vox-viewer';
import { useKeyGenerator } from '../../hooks/use-key-generator';
import { useToggle } from 'react-use';

export function ModelFilePreview(props: { voxFile: ParsedVoxFile; onReset?(): void }) {
  const flipCount = useKeyGenerator(props.voxFile);
  return (
    <div>
      <Button onClick={props.onReset}>Back</Button>
      <ModelViewer voxFile={props.voxFile} key={flipCount} />
    </div>
  );
}

function ModelViewer(props: { voxFile: ParsedVoxFile }) {
  const modelIndex = useCounter({ defaultValue: 0, min: 0, max: props.voxFile.models.length });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enableInspector, toggleInspector] = useToggle(false);

  const sceneHandleP = useVoxViewer(canvasRef, { file: props.voxFile, modelIndex: ~~modelIndex.value });

  useEffect(() => {
    sceneHandleP.then((handle) => {
      handle.toggleInspector(enableInspector);
    });
  }, [enableInspector, sceneHandleP]);

  return (
    <div className="bg-black">
      <div>
        <Button onClick={toggleInspector}>{enableInspector ? 'disable' : 'enable'} inspector</Button>
      </div>
      <div>
        <canvas height={480} width={960} ref={canvasRef} />
      </div>
    </div>
  );
}
