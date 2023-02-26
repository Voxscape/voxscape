import { PrivacyPolicy } from '../src/components/meta/agreements';
import React from 'react';
import { Layout } from '../src/components/layout/layout';

function PrivatePolicyPage(): React.ReactElement {
  return (
    <Layout>
      <PrivacyPolicy />
    </Layout>
  );
}
export default PrivatePolicyPage;
