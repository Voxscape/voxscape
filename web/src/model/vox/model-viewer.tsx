import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useCounter, useToggle } from 'react-use';

import { OnlyInDev } from '../../_dev/only-in-dev';
import { createDebugLogger } from '../../../shared/logger';
import { ModelCanvas } from './model-canvas';
import { ViewerConfig, ViewerTarget } from './use-vox-scene-handle';
import { Select, Button } from '@radix-ui/themes';
import { IconBug } from '@tabler/icons-react';

const logger = createDebugLogger(__filename);

export function ModelViewer(props: { voxFile: ParsedVoxFile }) {
  const [viewerTarget, setViewerTarget] = useState<null | ViewerTarget>(null);
  const [viewerConfig, setViewerConfig] = useState<null | ViewerConfig>(null);

  return (
    <div>
      <div>{viewerTarget && viewerConfig && <ModelCanvas target={viewerTarget} config={viewerConfig} />}</div>
      <div className="flex justify-between mt-2 px-1 md:px-0">
        <div>
          {props.voxFile.models.length < 1 ? (
            <ViewerTargetButtonPicker voxFile={props.voxFile} onChange={setViewerTarget} />
          ) : (
            <ViewerTargetSelectPicker voxFile={props.voxFile} onChange={setViewerTarget} />
          )}
        </div>
        <div>
          <ViewerConfigPicker onInput={setViewerConfig} />
        </div>
      </div>
    </div>
  );
}

function ViewerTargetSelectPicker(props: { voxFile: ParsedVoxFile; onChange(value: ViewerTarget): void }) {
  const [modelIndex, setModelIndex] = useCounter(0, props.voxFile.models.length - 1);
  useEffect(() => {
    props.onChange({ file: props.voxFile, modelIndex });
  }, [props.voxFile, modelIndex]);
  return (
    <Select.Root defaultValue="0" onValueChange={(value) => setModelIndex.set(+value)}>
      <Select.Trigger />
      <Select.Content>
        <Select.Group>
          <Select.Label>Models</Select.Label>

          {props.voxFile.models.map((model, index) => (
            <Select.Item value={String(index)}>Model {index + 1}</Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}

function ViewerTargetButtonPicker(props: { voxFile: ParsedVoxFile; onChange(value: ViewerTarget): void }) {
  const [modelIndex, setModelIndex] = useCounter(0, props.voxFile.models.length - 1);
  useEffect(() => {
    props.onChange({ file: props.voxFile, modelIndex });
  }, [props.voxFile, modelIndex]);
  return props.voxFile.models.map((model, index) => {
    return (
      <Button
        variant="outline"
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
  const [showAxes, toggleAxes] = useToggle(false);
  useEffect(() => {
    props.onInput({
      enableInspector,
      enableLight,
      showAxes,
    });
  }, [enableLight, showAxes, enableInspector]);

  return (
    <div className="space-x-1">
      <Button variant="outline" onClick={toggleLight}>
        {enableLight ? 'disable' : 'enable'} light
      </Button>
      <Button variant="outline" onClick={toggleAxes}>
        {showAxes ? 'hide' : 'show'} ref axes
      </Button>
      <OnlyInDev>
        <Button onClick={toggleInspector}>
          <IconBug />
        </Button>
      </OnlyInDev>
    </div>
  );
}
