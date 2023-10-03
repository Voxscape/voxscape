import Link from 'next/link';
import { DummyImage } from '../../_dev/dummy-image';

interface ModelBrief {
  id: string;
  title: string;
  desc: string;
  createdAt: Date;
}

function ModelListCard({ model }: { model: ModelBrief }) {
  return (
    <div className="inline-block px-4 border">
      <div>
        <DummyImage text={model.title ?? 'preview'} className="h-48 " />
      </div>
      <div>
        <h6 className="whitespace-pre-line text-xl pl-4">{model.title || '\n'}</h6>
      </div>
    </div>
  );
}

export function ModelList(props: { voxModels: ModelBrief[] }) {
  return (
    <ol className="grid grid-flow-row auto-rows-max md:grid-cols-2 lg:grid-cols-3">
      {props.voxModels.map((model) => (
        <li key={model.id} className="inline-block my-3 text-center">
          <Link href={`/models/vox/${model.id}`}>
            <ModelListCard model={model} />
          </Link>
        </li>
      ))}
    </ol>
  );
}
