'use client';
import { MutableRefObject, PropsWithChildren, PropsWithoutRef, ReactElement, useEffect, useRef } from 'react';
import styles from './model-canvas.module.scss';
import { BabylonEngineProvider } from '../_babylon/use-babylon-engine';
import { useKeyGenerator } from '../../hooks/use-key-generator';
import { useRefAxis, useRenderVox, useVoxSceneHandle, ViewerConfig, ViewerTarget } from './use-vox-scene-handle';
import { Engine } from '@babylonjs/core';
import { VoxSceneHandle } from './vox-scene-handle';
import { isDevBuild } from '../../config/build-config';
import { OnlyInDev } from '../../_dev/only-in-dev';
import clsx from 'clsx';

export function ModelCanvas({
  className,
  config,
  target,
}: PropsWithoutRef<{ className?: string; target: ViewerTarget; config: ViewerConfig }>): ReactElement {
  const inspectorRootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flipCount = useKeyGenerator(target.file, target.modelIndex);
  const sceneHandleRef = useRef<undefined | VoxSceneHandle>(undefined);

  useEffect(() => {
    if (!isDevBuild) {
      return;
    }
    sceneHandleRef.current?.toggleInspector(
      config.enableInspector ?? false,
      inspectorRootRef.current ?? canvasRef.current?.parentElement ?? undefined,
    );
  }, [sceneHandleRef.current, config.enableInspector]);

  return (
    <>
      <canvas className={clsx(styles.viewer, className)} height={480} width="100%" ref={canvasRef} />
      <BabylonEngineProvider canvasRef={canvasRef}>
        {(engine) => (
          <ModelRenderer
            key={flipCount}
            canvas={canvasRef.current!}
            engine={engine}
            handleRef={sceneHandleRef}
            target={target}
            config={config}
          />
        )}
      </BabylonEngineProvider>
      <OnlyInDev>
        <div ref={inspectorRootRef} />
      </OnlyInDev>
    </>
  );
}
function ModelRenderer(props: {
  canvas: HTMLCanvasElement;
  engine: Engine;
  handleRef: MutableRefObject<undefined | VoxSceneHandle>;
  target: ViewerTarget;
  config: ViewerConfig;
}): null {
  const sceneHandle = useVoxSceneHandle(props.canvas, props.engine);
  useRefAxis(props.target, props.config, sceneHandle);
  useRenderVox(props.target, props.config, sceneHandle);

  useEffect(() => {
    props.handleRef.current = sceneHandle ?? undefined;
  }, [sceneHandle]);

  return null;
}
