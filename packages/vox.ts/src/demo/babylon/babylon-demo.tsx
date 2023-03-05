import React, { useEffect, useRef, useState } from 'react';
import { ParsedVoxFile } from '../../types/vox-types';
import { useMounted } from '../components/hooks/use-mounted';
import { binaryConversion } from '../../util/binary-conversion';
import { basicParser } from '../../parser/basic-parser';
import { BabylonModelRenderer } from './babylon-model-renderer';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';

interface ModelPath {
  file: string;
  modelIndex: string;
}

export const BabylonDemo: React.FC<{ path?: ModelPath }> = (props) => {
  const [model, setModel] = useState<null | ParsedVoxFile>(null);

  useAsyncEffect(
    async (mounted) => {
      if (props.path?.file) {
        const blob = await fetch('/ref-models-2/' + encodeURIComponent(props.path.file).replaceAll('%2F', '/')).then(
          (_) => _.blob(),
        );
        const parsed = basicParser(await binaryConversion.blob.toArrayBuffer(blob));
        setModel(parsed);
      }
    },
    [props.path],
  );

  if (model) {
    return (
      <div className="p-4">
        <h1 className="mb-2 text-xl">model viewer</h1>
        <BabylonModelRenderer
          modelFile={model}
          modelIndex={Number(props.path?.modelIndex ?? '0')}
          onReset={() => setModel(null)}
        />
      </div>
    );
  } else {
    return (
      <div className="p-4">
        <h1 className="mb-2 text-xl">pick a vox file</h1>
        <BabylonFilePicker onModelRead={setModel} />
      </div>
    );
  }
};

const BabylonFilePicker: React.FC<{ onModelRead?(got: ParsedVoxFile): void }> = (props) => {
  const [reading, setReading] = useState(false);
  const mounted = useMounted();

  const [file, setFile] = useState<null | File>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // TODO
  }, [file]);

  const doReadBlob = async (blob: Blob) => {
    const bytes = await binaryConversion.blob.toArrayBuffer(blob);
    const parsed = basicParser(bytes);
    if (parsed.models.length >= 1) {
      props.onModelRead?.(parsed);
    } else {
      console.error('cannot read model', bytes, parsed);
    }
  };

  const onFileSelected = async (f: File) => {
    try {
      if (reading) return;
      setReading(true);
      await doReadBlob(f);
    } finally {
      if (mounted.current && inputRef.current) {
        setReading(false);
        inputRef.current.value = '';
      }
    }
  };

  const onRequestResource = async (url: string) => {
    try {
      if (reading) return;
      setReading(true);
      const blob = await fetch(url).then((_) => _.blob());
      await doReadBlob(blob);
    } finally {
      mounted.current && setReading(false);
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
            disabled={reading}
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
              disabled={reading}
              onClick={() => onRequestResource(path)}
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
