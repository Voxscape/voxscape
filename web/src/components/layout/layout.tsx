import React from 'react';
import { chakra } from '@chakra-ui/react';
import { LayoutHeader, LayoutHeaderButtons } from './header';
import { LayoutFooter } from './footer';
import { DevLinks } from '../../../pages/dev/dev-links';

export const Layout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <chakra.div display="flex" className="mx-auto max-w-screen-sm md:max-w-screen-md" flexDir="column" minH="100vh">
      <DevLinks />
      <LayoutHeader>
        <LayoutHeaderButtons />
      </LayoutHeader>
      <chakra.div flex="1 0" className="py-4 container" alignSelf="center">
        {props.children}
      </chakra.div>
      <LayoutFooter />
    </chakra.div>
  );
};
