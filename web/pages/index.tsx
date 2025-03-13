import { NextPage } from 'next';
import { Layout } from '../src/layout/layout';
import { IndexPageModelList } from '../src/model/list/model-list';
const IndexPage: NextPage = (props) => {
  return (
    <Layout>
      <IndexPageModelList />
    </Layout>
  );
};
export default IndexPage;
