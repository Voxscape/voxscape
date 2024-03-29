import React from 'react';
import { chakra } from '@chakra-ui/react';
import { LayoutHeader, LayoutHeaderButtons } from './header';
import { LayoutFooter } from './footer';
import { OnlyInDev } from '../_dev/only-in-dev';
import { DevLinks, FpsMeter } from '../_dev/dev-links';

export const Layout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <chakra.div display="flex" className="mx-auto max-w-screen-sm md:max-w-screen-md" flexDir="column" minH="100vh">
      <OnlyInDev>
        <DevLinks />
        <FpsMeter />
      </OnlyInDev>
      <LayoutHeader />
      <chakra.div flex="1 0" className="py-4 container" alignSelf="center">
        {props.children}
      </chakra.div>
      <LayoutFooter />
    </chakra.div>
  );
};
