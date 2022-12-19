import { Button, chakra } from '@chakra-ui/react';
import { BabylonSceneView, SceneManager } from '../model/babylon-scene-view';
import React, { useEffect, useRef } from 'react';
import { builtinTexture, createMaskTapeScene, loadBadgeModel, loadCupModel } from './scene-builders';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';
import { useModalApi } from '../modal/modal-context';

export const MrkPoc: React.FC<{}> = (props) => {
  const textureFileRef = useRef<HTMLInputElement>(null!);
  const sceneManagerRef = useRef<SceneManager>(null!);
  const modalApi = useModalApi();

  const onAddShirtScene = async () => {
    const modelFile = textureFileRef.current.files?.[0] ?? undefined;
    if (!modelFile) {
      await modalApi.alert(
        'image file not selected',
        'please select an image file. it will be used as dynamic texture',
      );
      return;
    }
    const confirmed = await modalApi.confirm('really?', 'confirm demo', {
      destructive: false,
      confirmButtonText: 'Proceed',
    });
    console.debug('confirmed', confirmed);
    if (!confirmed.value) return;
    while (true) {
      if (sceneManagerRef.current) break;
      await wait(0.1e3);
    }
    const { current: sceneManager } = sceneManagerRef;
    // await import('@babylonjs/inspector');
    // const scene = await tryLoad(sceneManager.canvas);
    const index = await sceneManager.addScene('preview', createMaskTapeScene(modelFile));
    await sceneManager.switchScene(index);
  };

  useAsyncEffect(async (running) => {
    await wait(0.1e3);
    const sceneManager = sceneManagerRef.current;
    if (!(running.current && sceneManager)) return;
    console.debug('sceneManager', sceneManagerRef);

    const sceneIndex = await sceneManager.addScene('mask-tape', loadCupModel);
    await sceneManager.switchScene(sceneIndex);
  }, []);

  return (
    <chakra.div p={2}>
      <div className="max-w-screen-md mx-auto text-right">
        <chakra.input type="file" ref={textureFileRef} placeholder="texture file" />
        <Button size="sm" onClick={onAddShirtScene} className="px-2">
          create scene
        </Button>
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
