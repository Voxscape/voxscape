import { useApiClient } from '../../api/use-api-client';
import type React from 'react';
import { Button } from '@blueprintjs/core';
import { FaIcon } from '@jokester/ts-commonutil/lib/react/component/font-awesome';

export const TwitterOAuth1Button: React.FC = () => {
  const apiClient = useApiClient();
  const onClick = async () => {
    const intent = await apiClient.useApi((api) => api.postAuthnOauth1Provider({ provider: 'twitter_oauth1' }));
    console.debug('would redirect to', intent.externalUrl);
  };

  return (
    <Button type="button" onClick={onClick}>
      Login With Twitter <FaIcon icon="twitter" />
    </Button>
  );
};
