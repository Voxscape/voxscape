import React from 'react';
import { chakra } from '@chakra-ui/react';
import { LayoutHeader, LayoutHeaderButtons } from './header';
import { LayoutFooter } from './footer';
import { DevLinks } from '../../../pages/dev/dev-links';

export const Layout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <chakra.div display="flex" flexDir="column" minH="100vh">
      <DevLinks />
      <LayoutHeader>
        <LayoutHeaderButtons />
      </LayoutHeader>
      <chakra.div flex="1 0" className="max-w-screen-sm md:max-w-screen-md py-4 w-full" alignSelf="center">
        {props.children}
      </chakra.div>
      <LayoutFooter />
    </chakra.div>
  );
};
