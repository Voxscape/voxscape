import { Button, ButtonGroup, chakra } from '@chakra-ui/react';
import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import styles from './header.module.scss';
import Link from 'next/link';
import { LoginButton, LogoutButton, NewModelButton, SelfUserButton, SettingButton } from './header/header_button';
import clsx from 'clsx';
import { pixelFonts } from '../styles/pixelBorders';

export const LayoutHeader: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div>
      <chakra.div
        display="flex"
        alignItems="baseline"
        justifyContent="space-between"
        marginX="auto"
        paddingX={[4]}
        paddingY={[2, null, 2]}
        borderBottom="2px solid"
        borderColor="primary.50"
      >
        <Link href="/" title="Voxscape" className={styles.logoText}>
          Voxscape
        </Link>
        <div className={clsx(pixelFonts.base, 'mx-2 flex-0 hidden md:block')}>gist for voxel models</div>
        <chakra.span flex="1 0" />
        <LayoutHeaderButtons />
      </chakra.div>
    </div>
  );
};

export const LayoutHeaderButtons: React.FC = () => {
  const session = useSession();

  if (session?.status === 'authenticated' && session.data?.user) {
    return (
      <ButtonGroup>
        <NewModelButton />
        <SelfUserButton userId={session.data.user.id} />
      </ButtonGroup>
    );
  } else {
    return (
      <ButtonGroup>
        <NewModelButton />
        <LoginButton />
      </ButtonGroup>
    );
  }
};
