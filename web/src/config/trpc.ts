import { createTRPCProxyClient, httpBatchLink, httpLink } from '@trpc/client';
import type { AppRouter } from '../../server/api';
import { createTRPCReact } from '@trpc/react-query';
import { inBrowser } from './build-config';
import { QueryClient } from '@tanstack/react-query';
import superjson from 'superjson';

function getBaseUrl() {
  if (inBrowser) {
    // browser should use relative path
    return '';
  }
  return 'http://undefined.internal:3000/api_base_url_not_set_for_ssr';
}

export const trpcReact = createTRPCReact<AppRouter>({});

const links = [
  httpBatchLink({
    url: `${getBaseUrl()}/api/trpc`,
    headers() {
      return {
        'x-custom-header': 'hello',
      };
    },
  }),
];
export const queryClient = new QueryClient();
export const trpcReactClient = trpcReact.createClient({
  links,
  transformer: superjson,
});

const trpcImperativeClient = createTRPCProxyClient<AppRouter>({
  links,
  transformer: superjson,
});

export const trpcClient = {
  hook: trpcReact,
  $: trpcImperativeClient,
} as const;

export function useTrpcClient(): typeof trpcClient {
  return trpcClient;
}
