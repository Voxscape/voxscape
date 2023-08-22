import { Button, ButtonGroup, chakra } from '@chakra-ui/react';
import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import styles from './header.module.scss';
import Link from 'next/link';
import { LoginButton, LogoutButton, NewModelButton, OwnUserButton, SettingButton } from './header/header_button';

export const LayoutHeader: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div>
      <chakra.div
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginX="auto"
        paddingX={[2, null, 2]}
        paddingY={[2, null, 2]}
        borderBottom="2px solid"
        borderColor="primary.50"
      >
        <Link href="/" title="Voxscape" className={styles.logoText}>
          Voxscape
        </Link>
        <div className="mx-2" flex="0 0">
          <NewModelButton />
        </div>
        <chakra.span flex="1 0" />
        <LayoutHeaderButtons />
      </chakra.div>
    </div>
  );
};

export const LayoutHeaderButtons: React.FC = () => {
  const session = useSession();
  const loginButton = (session.status === 'unauthenticated' || session.status === 'loading') && <LoginButton />;
  const logoutButton = session.status === 'authenticated' && <LogoutButton />;
  const userButton = session.status === 'authenticated' && <OwnUserButton userId={session.data.user!.id} />;

  return (
    <ButtonGroup>
      {userButton}
      {loginButton}
      {logoutButton}
    </ButtonGroup>
  );
};
