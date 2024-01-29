import Link from 'next/link';
import { DummyImage } from '../../_dev/dummy-image';
import { pixelBorders, pixelFonts } from '../../styles/pixelBorders';
import clsx from 'clsx';

interface ModelBrief {
  id: string;
  title?: null | string;
  desc: string;
  createdAt: Date;
}

function ModelListCard({ model }: { model: ModelBrief }) {
  return (
    <div className={clsx(pixelBorders.box.light, 'inline-block border')}>
      <div>
        <DummyImage text={model.title ?? 'preview'} className="h-48 " />
      </div>
      <div>
        <h6 className={clsx('p-2 text-left whitespace-pre-line text-xl')}>{model.title || '\n'}</h6>
      </div>
    </div>
  );
}

export function ModelListView(props: { voxModels: ModelBrief[] }) {
  return (
    <ol className="grid grid-flow-row auto-rows-max md:grid-cols-2">
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
