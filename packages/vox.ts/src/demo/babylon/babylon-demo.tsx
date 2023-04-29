import React, { useEffect, useRef, useState } from 'react';
import { ParsedVoxFile } from '../../types/vox-types';
import { useMounted } from '../components/hooks/use-mounted';
import { binaryConversion } from '../../util/binary-conversion';
import { basicParser } from '../../parser/basic-parser';
import { BabylonModelRenderer } from './babylon-model-renderer';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';

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
      const blob = await fetch(modelUrl).then((_) => _.blob());
      const parsed = basicParser(await binaryConversion.blob.toArrayBuffer(blob));
      setModel(parsed);
      // TODO: revoke if it's a object URL
    },
    [modelUrl],
  );
  return model;
}

export const BabylonDemo: React.FC<{ initialPath?: ModelPath }> = (props) => {
  const [modelUrl, setModelUrl] = useState(props.initialPath?.modelUrl);
  const model = useDemoModel(modelUrl);
  if (model) {
    return (
      <div className="p-4">
        <h1 className="mb-2 text-xl">model viewer</h1>
        <BabylonModelRenderer modelFile={model} modelIndex={Number(props.initialPath?.modelIndex ?? '0')} />
      </div>
    );
  } else {
    return (
      <div className="p-4">
        <h1 className="mb-2 text-xl">pick a vox file</h1>
        <BabylonFilePicker onModelRead={setModelUrl} />
      </div>
    );
  }
};

const BabylonFilePicker: React.FC<{ onModelRead?(modelUrl: string): void }> = (props) => {
  const mounted = useMounted();

  const [file, setFile] = useState<null | File>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const onFileSelected = async (f: File) => {
    try {
      const url = URL.createObjectURL(f);
      props.onModelRead?.(url);
    } finally {
      if (mounted.current && inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <ul>
        <li>
          Load file:
          <input
            type="file"
            ref={inputRef}
            onChange={(ev) => {
              const file0 = ev.target.files?.item(0);
              file0 && onFileSelected(file0);
            }}
          />
        </li>
        {demoAssets.map((path, i) => (
          <li key={i}>
            <button
              type="button"
              className="border border-white p-1 disabled:opacity-25"
              onClick={() => props.onModelRead?.(path)}
            >
              load {path}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const demoAssets = ['/ref-models/chr_fox.vox', '/ref-models/deer.vox', '/ref-models/monu8.vox'] as const;
