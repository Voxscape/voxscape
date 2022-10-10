import React from 'react';
import App, { AppType } from 'next/app';
import '../src/app.scss';
import { DefaultMeta } from '../src/components/meta/default-meta';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { chakraTheme } from '../src/config/chakra-theme';

const CustomApp: AppType = (props) => {
  const { Component, pageProps } = props;
  return (
    <ChakraProvider theme={chakraTheme}>
      <Head>
        <meta
          key="meta-viewport"
          name="viewport"
          content="width=device-width, initial-scale=1,maximum-scale=1.5,minimum-scale=1"
        />
      </Head>
      <DefaultMeta />
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

CustomApp.getInitialProps = App.getInitialProps;

export default CustomApp;
