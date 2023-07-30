import type React from 'react';
import { FaIcon } from '@jokester/ts-commonutil/lib/react/component/font-awesome';
import { signIn } from 'next-auth/react';
import { ModalHandle, useModalApi } from '../../modal/modal-context';
import styles from './header_button.module.scss';
import { Button } from '@chakra-ui/react';
import { IconLogin, IconScriptPlus, IconSettings, IconUser } from '@tabler/icons-react';
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

export const OwnUserButton: React.FC<{ userId: string }> = (props) => {
  return (
    <Link href={`/users/${props.userId}`}>
      <Button size="sm" className={styles.authButton}>
        <IconUser />
      </Button>
    </Link>
  );
};

export const SettingButton: React.FC = () => {
  return (
    <Link href="/settings">
      <Button size="sm" className={styles.authButton}>
        <IconSettings />
      </Button>
    </Link>
  );
};

export const AuthButton: React.FC = () => {
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

  return (
    <Button size="sm" className={styles.headerButton} onClick={onStartAuth}>
      <IconLogin />
    </Button>
  );
};

export const NewModelButton = () => {
  return (
    <Link href="/models/new">
      <Button size="sm" type="button">
        <IconScriptPlus />
      </Button>
    </Link>
  );
};
