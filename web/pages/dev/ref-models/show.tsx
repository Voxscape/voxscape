import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { PageMeta } from '../../../src/components/meta/page-meta';

const RefModelsShowPage: NextPage = (props) => {
  const path = useRouter().query.path;

  useEffect(() => {
    if (typeof path === 'string') {
      const fullPath = `/ref-models/${path}`;
      fetch(fullPath).then(async (res) => {
        const blob = await res.blob();
        console.debug('blob', blob);
      });
    }
  }, [path]);

  return (
    <div>
      <PageMeta title={`ref-models/${path}`} />
      TODO: render {path}
    </div>
  );
};

export default RefModelsShowPage;
