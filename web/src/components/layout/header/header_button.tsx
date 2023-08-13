import type React from 'react';
import { FaIcon } from '@jokester/ts-commonutil/lib/react/component/font-awesome';
import { signIn, signOut } from 'next-auth/react';
import { ModalHandle, useModalApi } from '../../modal/modal-context';
import styles from './header_button.module.scss';
import { Button } from '@chakra-ui/react';
import {
  IconFilePlus,
  IconLogin,
  IconLogout,
  IconScriptPlus,
  IconSettings,
  IconSquarePlus,
  IconUser,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

function AuthProviderPicker(props: { handle: ModalHandle<string> }) {
  const fulfill = (provider: string) => props.handle.deferred.fulfill(provider);
  return (
    <div className="flex flex-col space-y-4">
      <Button className={styles.authButton} onClick={() => fulfill('twitter')}>
        <FaIcon icon="twitter" />
        Log in with Twitter
      </Button>
      <Button className={styles.authButton} onClick={() => fulfill('discord')}>
        Log in with Discord
      </Button>
      <Button className={styles.authButton} onClick={() => fulfill('google')}>
        Log in with Google
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

export const LoginButton: React.FC = () => {
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

export const LogoutButton: React.FC = () => {
  const modal = useModalApi();
  const router = useRouter();

  const onLogout = async () => {
    const confirmed = await modal.confirm('Logout?', '');
    if (confirmed.value) {
      signOut().then(() => router.reload());
    }
  };

  return (
    <Button size="sm" className={styles.headerButton} onClick={onLogout}>
      <IconLogout />
    </Button>
  );
};

export const NewModelButton = () => {
  return (
    <Link href="/models/new">
      <Button size="sm" type="button">
        <IconFilePlus />
      </Button>
    </Link>
  );
};
