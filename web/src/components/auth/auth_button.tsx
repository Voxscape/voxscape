import type React from 'react';
import { FaIcon } from '@jokester/ts-commonutil/lib/react/component/font-awesome';
import { signIn, useSession } from 'next-auth/react';
import { ModalHandle, useModalApi } from '../modal/modal-context';
import styles from './auth.module.scss';
import { Button } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { IconSettings, IconUser } from '@tabler/icons-react';
import Link from 'next/link';

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

const UserButton: React.FC<{ userId: string }> = (props) => {
  return (
    <Link href={`/users/${props.userId}`}>
      <Button size="sm" className={styles.authButton}>
        <IconUser />
      </Button>
    </Link>
  );
};

const SettingButton: React.FC = () => {
  return (
    <Link href="/settings">
      <Button size="sm" className={styles.authButton}>
        <IconSettings />
      </Button>
    </Link>
  );
};

export const AuthButton: React.FC = () => {
  const session = useSession();
  const modal = useModalApi();

  const onStartAuth = async () => {
    const provider = await modal.build<string>((handle) => ({
      title: 'auth',
      body: <AuthProviderPicker handle={handle} />,
    }));

    if (provider.value) {
      signIn(provider.value, {});
    }
  };

  if (session.data?.user?.id) {
    return (
      <>
        <UserButton session={session.data} />
        <SettingButton />
      </>
    );
  }

  return (
    <Button backgroundColor="primary.500" size="sm" className={styles.authButton} onClick={onStartAuth}>
      Login
    </Button>
  );
};
