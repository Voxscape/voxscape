import { Button, ButtonGroup, chakra } from '@chakra-ui/react';
import React from 'react';

export const LayoutHeader: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div>
      <chakra.div
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginX="auto"
        maxW="2xl"
        paddingX={[2, null, 3]}
        paddingY={[2, null, 4]}
        borderBottom="2px solid"
        borderColor="cyan.50"
      >
        <div>Voxscape</div>
        <chakra.span flex="1 0" />
        {props.children}
      </chakra.div>
    </div>
  );
};

export const LayoutHeaderButtons: React.FC = () => {
  return (
    <>
      <ButtonGroup>
        <Button backgroundColor="cyan.100" size="sm">
          Sign Up
        </Button>
        <Button backgroundColor="cyan.50" size="sm">
          Login
        </Button>
      </ButtonGroup>
    </>
  );
};
