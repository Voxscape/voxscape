import { useApiClient } from '../../api/use-api-client';
import type React from 'react';
import { Button } from '@blueprintjs/core';
import { FaIcon } from '@jokester/ts-commonutil/lib/react/component/font-awesome';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const TwitterOAuth1Button: React.FC = () => {
  const apiClient = useApiClient();
  const router = useRouter();

  const onClick = async () => {
    const intent = await apiClient.useApi((api) => api.authnOauth1StartAuth({ provider: 'twitter_oauth1' }));

    console.debug('redirecting to', intent.externalUrl);
    router.push(intent.externalUrl);
  };

  useEffect(() => {
    const query = router.query as { provider: string; oauth_token: string; oauth_verifier: string };

    console.debug('got query', query);

    if (query.provider === 'twitter_oauth1' && query.oauth_token && query.oauth_verifier) {
      apiClient
        .useApi((api) =>
          api.authnOauth1FinishAuth({
            oAuth1TempCred: {
              provider: query.provider,
              oauthToken: query.oauth_token,
              oauthVerifier: query.oauth_verifier,
            },
          }),
        )
        .catch(() => 0);
    }
    return () => {};
  }, [router]);

  return (
    <Button type="button" onClick={onClick}>
      Login With Twitter <FaIcon icon="twitter" />
    </Button>
  );
};
