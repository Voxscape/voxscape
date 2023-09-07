import { Layout } from '../src/layout/layout';
import { UserAgreement } from '../src/components/meta/agreements';
import { ReactElement } from 'react';

export default (): ReactElement => (
  <Layout>
    <UserAgreement />
  </Layout>
);
