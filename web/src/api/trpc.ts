import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../server/api';
import { createTRPCReact } from '@trpc/react-query';
import { inBrowser } from '../config/build-config';
import { NextPageContext } from 'next';
import { QueryClient } from '@tanstack/react-query';
function getBaseUrl() {
  if (inBrowser) {
    // browser should use relative path
    return '';
  }
  return 'http://undefined.internal:3000/api_base_url_not_set';
}

export const trpc = createTRPCReact<AppRouter, NextPageContext>({});

export const queryClient = new QueryClient();
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        return {
          'x-custom-header': 'hello',
        };
      },
    }),
  ],
});
