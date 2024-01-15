import type { ModalHandle } from '../modal/modal-context';
import { Button } from '@chakra-ui/react';
import { IconBrandDiscord, IconBrandGoogle, IconBrandTwitter } from '@tabler/icons-react';
import type React from 'react';

export function AuthProviderPicker(props: { handle: ModalHandle<string> }) {
  const fulfill = (provider: string) => props.handle.deferred.fulfill(provider);
  return (
    <div className="flex flex-col space-y-4">
      <Button className={''} onClick={() => fulfill('twitter')}>
        <IconBrandTwitter />
        Log in with Twitter
      </Button>
      <Button className={''} onClick={() => fulfill('discord')}>
        <IconBrandDiscord />
        Log in with Discord
      </Button>
      <Button className={''} onClick={() => fulfill('google')}>
        <IconBrandGoogle />
        Log in with Google
      </Button>
    </div>
  );
}
