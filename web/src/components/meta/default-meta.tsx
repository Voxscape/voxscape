import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export const DefaultMeta: React.FC<{ title?: string; fullTitle?: string }> = (props) => {
  const router = useRouter();
  const title = props.fullTitle ?? ((props.title && `${props.title} | Voxscape`) || 'Voxscape');
  const canonicalUrl = `https://voxscape.io${router.asPath}`;
  return (
    <Head>
      <title key="head-title">{title}</title>
      <link rel="canonical" key="link-canonical" href={canonicalUrl} />
    </Head>
  );
};
