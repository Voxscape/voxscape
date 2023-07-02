import { Button, ButtonGroup, chakra } from '@chakra-ui/react';
import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import styles from './header.module.scss';
import Link from 'next/link';
import { AuthButton } from '../auth/auth_button';

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
        <chakra.span flex="1 0" />
        {props.children}
      </chakra.div>
    </div>
  );
};

export const LayoutHeaderButtons: React.FC = () => {
  const session = useSession();
  return (
    <>
      <ButtonGroup>
        {session.status === 'authenticated' && <NewModelButton />}
        <AuthButton />
      </ButtonGroup>
    </>
  );
};

const NewModelButton = () => {
  const session = useSession();

  if (session.status === 'authenticated') {
    return (
      <Link href="/models/new">
        <Button size="sm" type="button">
          new model
        </Button>
      </Link>
    );
  }
  return null;
};
