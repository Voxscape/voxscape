import React, { useEffect, useRef, useState } from 'react';
import { ParsedVoxFile } from '../../types/vox-types';
import { useBabylonContext, useBabylonInspector } from './init-babylon';
import classNames from 'classnames';
import { useMounted } from '../components/hooks/use-mounted';
import { createRefAxes } from './deps/create-ref-axes';
import { renderPlayground } from './render-playground';
import { binaryConversion } from '../../util/binary-conversion';
import { basicParser } from '../../parser/basic-parser';
import { renderModel } from './render-vox-model';

export const BabylonDemo: React.FC = () => {
  const [model, setModel] = useState<null | ParsedVoxFile>(null);

  if (model) {
    return (
      <div className="p-4">
        <h1 className="mb-2 text-xl">model viewer</h1>
        <BabylonModelRenderer model={model} onReset={() => setModel(null)} />;
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

const BabylonModelRenderer: React.FC<{ onReset?(): void; model?: ParsedVoxFile }> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const babylonCtx = useBabylonContext(canvasRef);

  const started = useRef(false);

  useEffect(() => {
    if (!babylonCtx) {
      return;
    } else if (started.current) {
      return;
    }
    started.current = true;
    let effectRunning = true;

    // fixme: should re-init scene when model changes
    createRefAxes(100, babylonCtx.scene, babylonCtx.deps);
    babylonCtx.engine.start();

    if (props.model && props.model.models.length) {
      renderModel(babylonCtx, props.model.models[0], props.model, () => !effectRunning);
    } else {
      babylonCtx.camera.setRadius(50);
      renderPlayground(babylonCtx);
    }
    return () => {
      babylonCtx.engine.stop();
      effectRunning = false;
    };
  }, [babylonCtx, props.model]);

  const [enableInspector, setEnableInspector] = useState(false);
  useBabylonInspector(babylonCtx, enableInspector);

  return (
    <div className={classNames('py-24')}>
      <canvas ref={canvasRef} className={classNames('bg-white mx-auto')} style={{ width: 640, height: 480 }} />
      <hr />
      <p className="p-2 space-x-2">
        <button type="button" className="p-2" onClick={() => setEnableInspector(!enableInspector)}>
          {enableInspector ? 'disable inspector' : 'enable inspector'}
        </button>
        <button type="button" onClick={props.onReset}>
          reset
        </button>
      </p>
    </div>
  );
};

const demoAssets = ['/ref-models/chr_fox.vox', '/ref-models/deer.vox', '/ref-models/monu8.vox'] as const;
