import React, { useEffect } from 'react';
import App, { AppType } from 'next/app';
import '../src/app.scss';
import { DefaultMeta } from '../src/components/meta/default-meta';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { chakraTheme } from '../src/config/chakra-theme';
import { ModalHolder } from '../src/components/modal/modal-context';
import { SessionProvider } from 'next-auth/react';
import { isDevBuild } from '../src/config/build-config';

const CustomApp: AppType = (props) => {
  const { Component, pageProps } = props;
  const session = (pageProps as any).session;

  useEffect(() => {
    if (isDevBuild) {
      console.debug('session as seen by app', session);
    }
  }, [session]);

  return (
    <SessionProvider session={session}>
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
    </SessionProvider>
  );
};

// CustomApp.getInitialProps = App.getInitialProps;

export default CustomApp;
