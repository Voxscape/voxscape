import React from 'react';
import { chakra } from '@chakra-ui/react';
import { LayoutHeader, LayoutHeaderButtons } from './header';
import { LayoutFooter } from './footer';

export const Layout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <chakra.div>
      <LayoutHeader>
        <LayoutHeaderButtons />
      </LayoutHeader>
      <div>{props.children}</div>
      <LayoutFooter />
    </chakra.div>
  );
};
