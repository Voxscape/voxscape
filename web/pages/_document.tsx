import React from 'react';
import Document, { Html, Main, NextScript, Head } from 'next/document';
import { fontawesomeCss } from '@jokester/ts-commonutil/lib/react/component/font-awesome';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../server/next_auth';

const defaultStyleSheets = [
  // eslint-disable-next-line @next/next/no-page-custom-font
  <link
    key="font-roboto"
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
  />,
  <link key="manifest-pwa" rel="manifest" href="/manifest.json" />,
  fontawesomeCss,
  // <link key="font-material-icons" rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />,
] as const;

export default function CustomDocument(): React.ReactElement {
  return (
    <Html>
      <Head>{defaultStyleSheets} </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
