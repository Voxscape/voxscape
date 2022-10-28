import { Button, chakra } from '@chakra-ui/react';
import { BabylonSceneView, SceneManager } from '../model/babylon-scene-view';
import React, { useRef } from 'react';
import { createShirtPreviewScene } from './scene-builders';

export const MrkPoc: React.FC<{}> = (props) => {
  const textureFileRef = useRef<HTMLInputElement>(null!);
  const sceneManagerRef = useRef<SceneManager>(null!);

  const onAddShirtScene = async () => {
    const textureFile = textureFileRef.current.files?.[0] ?? undefined;
    const { current: sceneManager } = sceneManagerRef;
    const index = await sceneManager.addScene(
      `${sceneManager.scenes.length}-shirt`,
      createShirtPreviewScene(textureFile),
    );
    await sceneManager.switchScene(index);
  };

  return (
    <chakra.div p={2}>
      <Button size="sm" onClick={() => sceneManagerRef.current.toggleInspector()}>
        Toggle inspector
      </Button>
      <Button size="sm" onClick={onAddShirtScene}>
        create scene
      </Button>
      <chakra.input type="file" ref={textureFileRef} />
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
    </chakra.div>
  );
};
