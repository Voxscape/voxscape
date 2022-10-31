import React, { useEffect, useRef } from 'react';

export async function tryLoad(canvas: HTMLCanvasElement): Promise<void> {
  const core = await import('@babylonjs/core');
  // await import('@babylonjs/inspector');
  await import('@babylonjs/materials');
  await import('@babylonjs/loaders');
  await import('@babylonjs/loaders/glTF');

  const engine = new core.Engine(canvas);
  const loaded = await core.SceneLoader.LoadAsync('/blender/', 'shirt-split3.gltf', engine, (ev) =>
    console.debug('progress', ev),
  );
}

export const FailDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  useEffect(() => {
    tryLoad(canvasRef.current);

    return () => {};
  }, []);

  return <canvas ref={canvasRef} />;
};
