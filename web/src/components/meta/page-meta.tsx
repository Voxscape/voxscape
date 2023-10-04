import React from 'react';
import Head from 'next/head';

interface PageMetaProps {
  title?: null | string;
  fullTitle?: string;
  desc?: null | string;
  ogp?: OgpProps;
}

export interface OgpProps {}

export const PageMeta: React.FC<PageMetaProps> = (props) => {
  const title = props.fullTitle ?? (props.title && `${props.title} | Voxscape`) ?? 'Voxscape';
  return (
    <Head>
      <title key="head-title">{title}</title>
    </Head>
  );
};
