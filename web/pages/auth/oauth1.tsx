import { Layout } from '../../src/components/layout/layout';
import { TwitterAuthForm } from '../../src/components/auth/twitter_auth';
import React from 'react';

const OAuth1Page: React.FC = () => (
  <Layout>
    <TwitterAuthForm />
  </Layout>
);

export default OAuth1Page;
