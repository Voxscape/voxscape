import { Button, chakra, useModal } from '@chakra-ui/react';
import { useModalApi } from '../components/modal/modal-context';
import clsx from 'clsx';
import { pixelBorders, pixelFonts } from '../styles/pixelBorders';

function Buttons() {
  const modalApi = useModalApi();
  return (
    <>
      <h1>Buttons</h1>
      <div>
        <Button
          className={clsx(pixelBorders.box.light, pixelFonts.base)}
          onClick={() => modalApi.alert('alert', 'content')}
        >
          Open Modal
        </Button>
      </div>
    </>
  );
}

export const ChakraDemo: React.FC = () => {
  return (
    <div>
      <>
        <Buttons />
      </>
      <h1>Responsive</h1>
      <chakra.div marginX="auto" backgroundColor={['teal.50', 'red.50', 'yellow.50', 'blue.50', 'red.500', 'blue.500']}>
        dddddddd
      </chakra.div>
      <hr />

      <h1 className="text-center">Sizes</h1>

      <chakra.div width="xs" marginX="auto" backgroundColor="pink.50">
        xs
      </chakra.div>
      <chakra.div width="sm" marginX="auto" backgroundColor="pink.50">
        sm
      </chakra.div>
      <chakra.div width="md" marginX="auto" backgroundColor="pink.50">
        md
      </chakra.div>
      <chakra.div width="lg" marginX="auto" backgroundColor="pink.50">
        lg
      </chakra.div>
      <chakra.div width="xl" marginX="auto" backgroundColor="pink.50">
        xl
      </chakra.div>
      <chakra.div width="2xl" marginX="auto" backgroundColor="pink.50">
        2xl
      </chakra.div>
      <chakra.div width="3xl" marginX="auto" backgroundColor="pink.50">
        3xl
      </chakra.div>
      <chakra.div width="4xl" marginX="auto" backgroundColor="pink.50">
        4xl
      </chakra.div>
      <chakra.div width="5xl" marginX="auto" backgroundColor="pink.50">
        5xl
      </chakra.div>
      <chakra.div width="6xl" marginX="auto" backgroundColor="pink.50">
        6xl
      </chakra.div>
      <chakra.div width="7xl" marginX="auto" backgroundColor="pink.50">
        7xl
      </chakra.div>
      <chakra.div width="8xl" marginX="auto" backgroundColor="pink.50">
        8xl
      </chakra.div>
      <chakra.div width="9xl" marginX="auto" backgroundColor="pink.50">
        9xl
      </chakra.div>
      <hr />
    </div>
  );
};
