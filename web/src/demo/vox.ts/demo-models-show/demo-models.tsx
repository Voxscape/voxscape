import React, { useState } from 'react';
import { ParsedVoxFile } from '@voxscape/vox.ts/src/types/vox-types';
import { basicParser } from '@voxscape/vox.ts/src/parser/basic-parser';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { ModelViewer } from '../../../model/vox/model-viewer';

export interface ModelPath {
  modelUrl: string;
}

function useDemoModel(modelUrl?: string): null | ParsedVoxFile {
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
      const arrayBuffer = await fetch(rebuilt).then((_) => _.arrayBuffer());
      if (!mounted.current) {
        return;
      }
      const parsed = basicParser(arrayBuffer);
      setModel(parsed);
    },
    [modelUrl],
    true,
  );
  return model;
}

export const BabylonDemo: React.FC<{ initialPath: ModelPath }> = (props) => {
  const [modelUrl, setModelUrl] = useState(props.initialPath.modelUrl);
  const model = useDemoModel(modelUrl);
  if (model) {
    return (
      <div className="p-4">
        <h1 className="mb-2 text-xl">model viewer powered by vox.ts and Babylon.js</h1>
        {model && <ModelViewer voxFile={model} />}
      </div>
    );
  }
  return null;
};
