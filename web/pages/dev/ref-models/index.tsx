import { NextPage } from 'next';
import useConstant from 'use-constant';
import { fetchBaseModelIndex } from '../../../src/components/dev/ref-models';
import { usePromised } from '@jokester/ts-commonutil/lib/react/hook/use-promised';
import { PageMeta } from '../../../src/components/meta/page-meta';
import { RefModelsTable } from '../../../src/components/dev/ref-models-table';

const RefModelsIndexPage: NextPage = () => {
  const indexP = useConstant(() => fetchBaseModelIndex());
  const index = usePromised(indexP);

  return (
    <div>
      <PageMeta title="ref models" />
      {index.fulfilled ? (
        <RefModelsTable
          files={index.value}
          onClick={(m) => {
            window.open(`/dev/ref-models/show?path=${encodeURIComponent(m.path)}`, '_blank');
          }}
        />
      ) : (
        'loading...'
      )}
    </div>
  );
};

export default RefModelsIndexPage;
