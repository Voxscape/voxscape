import React from 'react';
import Head from 'next/head';

export const PageMeta: React.FC<{ title?: string }> = (props) => {
  // TODO: add ogps and stuff
  return (
    <Head>
      <title key="head-title">{props.title ?? 'untitled'}</title>
    </Head>
  );
};
