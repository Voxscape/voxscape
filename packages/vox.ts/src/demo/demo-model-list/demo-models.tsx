import React, { useEffect, useState } from 'react';
import { Button } from '@blueprintjs/core';
import { VoxFileDigest } from '../../parser/digester';
import style from './demo-model-list.module.scss';
import clsx from 'clsx';
import { fetchRefModelIndex } from '../ref-models';
import { RefModelsTable } from '../ref-models-table';

export const DemoModelList: React.FC<{ onPick?(): void }> = (props) => {
  const [files, setFiles] = useState<VoxFileDigest[]>([]);

  useEffect(() => {
    fetchRefModelIndex().then(setFiles);
  }, []);

  return <RefModelsTable files={files} onClick={(f, i) => props.onPick?.()} />;
};

const ModelPickerCell: React.FC<{ file: VoxFileDigest }> = ({ file }) => {
  const onOpenViewer = (modelIndex: number) => {
    window.open(`/demo-models/show?file=${encodeURIComponent(file.path)}&modelIndex=${modelIndex}`, '_blank');
  };
  return (
    <div>
      {file.models.map((m, modelIndex) => (
        <div key={modelIndex}>
          model#{modelIndex}: {m.size.x}x{m.size.y}x{m.size.z} / {m.numVoxels} voxels
          <br />
          <Button type="button" onClick={() => onOpenViewer(modelIndex)}>
            preview
          </Button>
          <hr />
        </div>
      ))}
    </div>
  );
};
