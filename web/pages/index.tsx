import { NextPage } from 'next';
import Link from 'next/link';
import { Layout } from '../src/components/layout/layout';
const IndexPage: NextPage = (props) => {
  return (
    <Layout>
      HHH
      <Link className="underscore" href="/dev/mrk-system-demo">
        sign up
      </Link>
    </Layout>
  );
};
export default IndexPage;
