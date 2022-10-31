import { NextPage } from 'next';
import { Button, chakra } from '@chakra-ui/react';
import { BabylonGltfRenderer, BabylonGltfRendererHandle } from '../../../src/components/model/babylon-gltf-renderer';
import { ChangeEvent, useRef } from 'react';
const Page: NextPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rendererRef = useRef<BabylonGltfRendererHandle>(null);
  const onLoadClick = () => {
    const file = fileInputRef.current?.files?.[0];
    file && rendererRef.current?.loadModel(file);
  };
  return (
    <chakra.div p={2}>
      <chakra.input type="file" ref={fileInputRef} />
      <Button size="sm" onClick={onLoadClick}>
        Load GLTF Model
      </Button>
      <Button size="sm" onClick={() => rendererRef.current?.toggleInspector()}>
        Toggle inspector
      </Button>
      <hr />
      <chakra.div p={1} m={1} borderColor="pink.50" border="1px dotted">
        <BabylonGltfRenderer
          canvasProps={{
            width: 800,
            height: 600,
            style: { outline: 'none', backgroundColor: '#eee', margin: '0 auto' },
          }}
          ref={rendererRef}
        />
      </chakra.div>
    </chakra.div>
  );
};

export default Page;
