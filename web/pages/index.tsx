import { NextPage } from 'next';
import { Layout } from '../src/layout/layout';
import '@pwabuilder/pwainstall';
const IndexPage: NextPage = (props) => {
  return (
    <Layout>
      {/* @ts-ignore */}
      <pwa-install></pwa-install>
    </Layout>
  );
};
export default IndexPage;
