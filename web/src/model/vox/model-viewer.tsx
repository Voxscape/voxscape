import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { Button } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useVoxSceneHandle } from './use-vox-scene-handle';
import { useKeyGenerator } from '../../hooks/use-key-generator';
import { useToggle } from 'react-use';

import { OnlyInDev } from '../../_dev/only-in-dev';

export function ModelViewer(props: { voxFile: ParsedVoxFile; onReset?(): void }) {
  const flipCount = useKeyGenerator(props.voxFile);
  return (
    <div>
      <RealModelViewer voxFile={props.voxFile} key={flipCount} onReset={props.onReset} />
    </div>
  );
}

function RealModelViewer(props: { voxFile: ParsedVoxFile; onReset?(): void }) {
  const [modelIndex, setModelIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inspectorRootRef = useRef<HTMLDivElement>(null);
  const [enableInspector, toggleInspector] = useToggle(false);

  const sceneHandleRef = useVoxSceneHandle(canvasRef, { file: props.voxFile, modelIndex });

  useEffect(() => {
    sceneHandleRef.current?.toggleInspector(enableInspector, inspectorRootRef.current ?? undefined);
  }, [enableInspector]);

  return (
    <div>
      <div>
        <Button onClick={props.onReset}>Back</Button>
        <ModelIndexPicker
          voxFile={props.voxFile}
          onChange={(value) => {
            toggleInspector(false);
            setModelIndex(value);
          }}
        />
        <OnlyInDev>
          <Button onClick={toggleInspector}>{enableInspector ? 'disable' : 'enable'} inspector</Button>
        </OnlyInDev>
      </div>
      <div>
        <canvas className="w-full h-64" height={480} width="100%" ref={canvasRef} />
      </div>
      <OnlyInDev>
        <div ref={inspectorRootRef} />
      </OnlyInDev>
    </div>
  );
}

function ModelIndexPicker(props: { voxFile: ParsedVoxFile; onChange?(value: number): void }) {
  return props.voxFile.models.map((model, index) => {
    return (
      <Button type="button" onClick={() => props.onChange?.(index)} key={index}>
        model #{index + 1}
      </Button>
    );
  });
}
