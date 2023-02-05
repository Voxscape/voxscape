import React, { Component, createRef, useRef } from 'react';
import { BabylonSceneView, SceneManager } from '../model/babylon-scene-view';
import { useModalApi } from '../modal/modal-context';
import { createGltfScene, createMaskTapeScene, loadCupModel } from '../mrk-system/scene-builders';
import { Button, chakra } from '@chakra-ui/react';

export const BabylonGltfSandbox: React.FC<{}> = () => {
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const sceneManagerRef = useRef<SceneManager>(null!);
  const modalApi = useModalApi();
  const loadCount = useRef(0);

  async function onStartLoad() {
    const f = fileInputRef.current.files?.[0];
    if (f && sceneManagerRef.current) {
      const sceneManager = sceneManagerRef.current;
      const index = await sceneManager.addScene(`scene-${++loadCount.current}`, createGltfScene(f));
      await sceneManager.switchScene(index);
      await sceneManager.toggleInspector(true);
    }
  }

  return (
    <chakra.div p={2}>
      <div className="max-w-screen-md mx-auto text-right">
        <chakra.input type="file" ref={fileInputRef} placeholder="gltf file" accept=".gltf,.glb" />
        <Button size="sm" onClick={onStartLoad} className="px-2">
          Load
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
