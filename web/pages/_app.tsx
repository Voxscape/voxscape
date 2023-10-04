import React, { FC, useEffect } from 'react';
import type { AppType } from 'next/app';
import '../src/styles/app.scss';
import { DefaultMeta } from '../src/components/meta/default-meta';
import Head from 'next/head';
import { ChakraProvider, Thead } from '@chakra-ui/react';
import { chakraTheme } from '../src/config/chakra-theme';
import { ModalHolder } from '../src/components/modal/modal-context';
import { SessionProvider, useSession } from 'next-auth/react';
import { isDevBuild } from '../src/config/build-config';
import type { Session } from 'next-auth';
import { queryClient, trpcReact, trpcReactClient } from '../src/config/trpc';
import { QueryClientProvider } from '@tanstack/react-query';
import { createDebugLogger } from '../shared/logger';
import { Theme } from '@radix-ui/themes';
const debug = createDebugLogger(__filename);

interface PageProps {
  // optional: provided by per-page getServerSideProps()
  session?: Session;
}

const SessionDemo: FC = () => {
  const session = useSession();
  useEffect(() => {
    debug('session as seen by app', session);
  }, [session]);
  return null;
};

const CustomApp: AppType<PageProps> = (props) => {
  const { Component, pageProps } = props;

  return (
    <SessionProvider session={pageProps.session}>
      {isDevBuild && <SessionDemo />}
      <trpcReact.Provider client={trpcReactClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Theme>
            <ChakraProvider theme={chakraTheme}>
              <Head>
                <meta
                  key="meta-viewport"
                  name="viewport"
                  content="width=device-width, initial-scale=1,maximum-scale=1.5,minimum-scale=1"
                />
              </Head>
              <DefaultMeta />
              <ModalHolder>
                <Component {...pageProps} />
              </ModalHolder>
            </ChakraProvider>
          </Theme>
        </QueryClientProvider>
      </trpcReact.Provider>
    </SessionProvider>
  );
};

export default CustomApp;
