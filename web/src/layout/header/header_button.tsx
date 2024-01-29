import type React from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useModalApi } from '../../components/modal/modal-context';
import styles from './header_button.module.scss';
import { Button } from '@chakra-ui/react';
import { IconFilePlus, IconLogin, IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthProviderPicker } from '../../components/auth/auth-provider-picker';

export const SelfUserButton: React.FC<{ userId: string }> = (props) => {
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
  const router = useRouter();

  const onStartAuth = async () => {
    const provider = await modal.build<string>((handle) => ({
      title: 'auth',
      body: <AuthProviderPicker handle={handle} />,
    }));

    if (provider.value) {
      signIn(provider.value, { callbackUrl: router.asPath });
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
    const confirmed = await modal.confirm('Logout', 'Really?');
    if (confirmed.value) {
      signOut().then(() => router.push('/'));
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
