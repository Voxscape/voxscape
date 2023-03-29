import type React from 'react';
import { FaIcon } from '@jokester/ts-commonutil/lib/react/component/font-awesome';
import { signIn, useSession } from 'next-auth/react';
import { ModalHandle, useModalApi } from '../modal/modal-context';
import styles from './auth.module.scss';
import clsx from 'clsx';
import { Button } from '@chakra-ui/react';

export const TwitterOAuth1Button: React.FC = () => {
  return (
    <button type="button">
      Login With Twitter <FaIcon icon="twitter" />
    </button>
  );
};

function AuthProviderPicker(props: { handle: ModalHandle<string> }) {
  const fulfill = (provider: string) => props.handle.deferred.fulfill(provider);
  return (
    <div className="flex flex-col space-y-4">
      <Button className={styles.authButton} onClick={() => fulfill('google')}>
        Log in with Google
      </Button>
      <Button className={styles.authButton} onClick={() => fulfill('discord')}>
        Log in with Discord
      </Button>
    </div>
  );
}

export const AuthButton: React.FC = () => {
  const session = useSession();
  const modal = useModalApi();

  const onStartAuth = async () => {
    console.debug('modal', modal, modal.build);
    const provider = await modal.build<string>((handle) => ({
      title: 'auth',
      body: <AuthProviderPicker handle={handle} />,
    }));

    if (provider.value) {
      signIn(provider.value, {});
    }
  };

  if (session.data?.user) {
    return (
      <Button color="primary.500" size="sm" className={styles.authButton}>
        {session.data.user.name}
      </Button>
    );
  }

  return (
    <Button backgroundColor="primary.500" size="sm" className={styles.authButton} onClick={onStartAuth}>
      Login
    </Button>
  );
};
