import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { Button } from '@chakra-ui/react';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useCounter, useToggle } from 'react-use';

import { OnlyInDev } from '../../_dev/only-in-dev';
import { createDebugLogger } from '../../../shared/logger';
import { ModelCanvas } from './model-canvas';
import { ViewerConfig, ViewerTarget } from './use-vox-scene-handle';

const logger = createDebugLogger(__filename);

export function ModelViewer(props: { voxFile: ParsedVoxFile; onBack?(): void }) {
  const [viewerTarget, setViewerTarget] = useState<null | ViewerTarget>(null);
  const [viewerConfig, setViewerConfig] = useState<null | ViewerConfig>(null);

  return (
    <div>
      <div>
        {props.onBack && <Button onClick={props.onBack}>Back</Button>}
        <ViewerTargetPicker voxFile={props.voxFile} onChange={setViewerTarget} />
        <ViewerConfigPicker onInput={setViewerConfig} />
        <div>{viewerTarget && viewerConfig && <ModelCanvas target={viewerTarget} config={viewerConfig} />}</div>
      </div>
    </div>
  );
}

function ViewerTargetPicker(props: { voxFile: ParsedVoxFile; onChange(value: ViewerTarget): void }) {
  const [modelIndex, setModelIndex] = useCounter(0, props.voxFile.models.length - 1);
  useEffect(() => {
    props.onChange({ file: props.voxFile, modelIndex });
  }, [props.voxFile, modelIndex]);
  return props.voxFile.models.map((model, index) => {
    return (
      <Button
        type="button"
        onClick={() => setModelIndex.set(index)}
        key={index}
        title={`${model.voxels.length} voxels`}
      >
        model #{index + 1}
      </Button>
    );
  });
}

function ViewerConfigPicker(props: { onInput(value: ViewerConfig): void }) {
  const [enableInspector, toggleInspector] = useToggle(false);
  const [enableLight, toggleLight] = useToggle(true);
  const [showAxes, toggleAxes] = useToggle(true);
  useEffect(() => {
    props.onInput({
      enableInspector,
      enableLight,
      showAxes,
    });
  }, [enableLight, showAxes, enableInspector]);

  return (
    <>
      <Button onClick={toggleLight}>{enableLight ? 'disable' : 'enable'} light</Button>
      <Button onClick={toggleAxes}>{showAxes ? 'hide' : 'show'} ref axes</Button>
      <OnlyInDev>
        <Button onClick={toggleInspector}>{enableInspector ? 'disable' : 'enable'} inspector</Button>
      </OnlyInDev>
    </>
  );
}
