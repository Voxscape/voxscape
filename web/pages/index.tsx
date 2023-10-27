import { NextPage } from 'next';
import { Layout } from '../src/layout/layout';
import { PwaInstall } from '../src/components/meta/pwa-install';
const IndexPage: NextPage = (props) => {
  return (
    <Layout>
      <PwaInstall />
    </Layout>
  );
};
export default IndexPage;
