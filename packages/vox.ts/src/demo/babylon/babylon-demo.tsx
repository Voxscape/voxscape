import React, { useState } from 'react';
import { ParsedVoxFile } from '../../types/vox-types';
import { binaryConversion } from '../../util/binary-conversion';
import { basicParser } from '../../parser/basic-parser';
import { BabylonModelRenderer } from './babylon-model-renderer';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import Link from 'next/link';

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

const demoAssets = ['/ref-models/chr_fox.vox', '/ref-models/deer.vox', '/ref-models/monu8.vox'] as const;

export const RefModelList = () => {
  return (
    <ul className="space-x-4">
      {demoAssets.map((path, i) => (
        <li key={i} className="inline-block">
          <Link href={`/demo-models/show?file=${path}`}>{path}</Link>
        </li>
      ))}
    </ul>
  );
};
