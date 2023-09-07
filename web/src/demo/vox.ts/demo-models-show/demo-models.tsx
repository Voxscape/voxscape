import React, { useState } from 'react';
import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { binaryConversion } from '@voxscape/vox.ts/src/util/binary-conversion';
import { basicParser } from '@voxscape/vox.ts/src/parser/basic-parser';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { BabylonModelRenderer } from './babylon-model-renderer';

export interface ModelPath {
  modelUrl: string;
  modelIndex: number | string;
}

function useDemoModel(modelUrl?: string) {
  const [model, setModel] = useState<null | ParsedVoxFile>(null);

  useAsyncEffect(
    async (mounted) => {
      if (!modelUrl) {
        setModel(null);
        return;
      }
      const escaped = modelUrl.replaceAll('#', () => encodeURIComponent('#'));
      // NOTE must ensure assetPath have exactly 1 leading slash,
      // or new URL(assetPath, location.href) will return a strange URL
      const assetPath = escaped.replace(/^\/*/, '/');
      const rebuilt = new URL(assetPath, window.location.href);
      console.debug('fetching', { modelUrl, escaped, absolutified: assetPath, rebuilt });
      const blob = await fetch(rebuilt).then((_) => _.blob());
      if (!mounted.current) {
        return;
      }
      const parsed = basicParser(await binaryConversion.blob.toArrayBuffer(blob));
      if (!mounted.current) {
        return;
      }
      setModel(parsed);
    },
    [modelUrl],
  );
  return model;
}

export const BabylonDemo: React.FC<{ initialPath: ModelPath; builder?: string }> = (props) => {
  const [modelUrl, setModelUrl] = useState(props.initialPath.modelUrl);
  const model = useDemoModel(modelUrl);
  if (model) {
    return (
      <div className="p-4">
        <h1 className="mb-2 text-xl">model viewer</h1>
        <BabylonModelRenderer
          modelFile={model}
          modelIndex={Number(props.initialPath?.modelIndex ?? '0')}
          builder={props.builder}
        />
      </div>
    );
  }
  return null;
};
