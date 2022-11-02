import { Button, chakra } from '@chakra-ui/react';
import { BabylonSceneView, SceneManager } from '../model/babylon-scene-view';
import React, { useRef } from 'react';
import { createShirtPreviewScene } from './scene-builders';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';

export const MrkPoc: React.FC<{}> = (props) => {
  const textureFileRef = useRef<HTMLInputElement>(null!);
  const sceneManagerRef = useRef<SceneManager>(null!);

  const onAddShirtScene = async () => {
    const modelFile = textureFileRef.current.files?.[0] ?? undefined;
    const { current: sceneManager } = sceneManagerRef;
    // await import('@babylonjs/inspector');
    // const scene = await tryLoad(sceneManager.canvas);
    const index = await sceneManager.addScene('wtf', createShirtPreviewScene(modelFile!));
    await sceneManager.switchScene(index);
  };

  useAsyncEffect(async (mounted, effectReleased) => {
    await wait(2e3);
    if (!mounted.current) return;
    const { current: sceneManager } = sceneManagerRef;
    const index = await sceneManager.addScene(
      'wtf',
      createShirtPreviewScene('/demo-models/CustomUVChecker_byValle_1K.png'),
    );

    await sceneManager.switchScene(index);
  }, []);

  return (
    <chakra.div p={2}>
      <div>
        <Button size="sm" onClick={onAddShirtScene}>
          create scene
        </Button>
        <chakra.input type="file" ref={textureFileRef} placeholder="texture file" />
      </div>
      <hr />
      <chakra.div p={1} m={1} borderColor="pink.50" border="1px dotted">
        <BabylonSceneView
          canvasProps={{
            width: 800,
            height: 600,
            style: { outline: 'none', backgroundColor: '#eee', margin: '0 auto' },
          }}
          ref={sceneManagerRef}
        />
      </chakra.div>
      <div>
        <Button size="sm" onClick={() => sceneManagerRef.current.toggleInspector()}>
          Toggle inspector
        </Button>
      </div>
    </chakra.div>
  );
};
