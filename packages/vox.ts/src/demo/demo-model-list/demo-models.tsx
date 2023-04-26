import React, { useEffect, useState } from 'react';
import { Button } from '@blueprintjs/core';
import { VoxFileDigest } from '../../parser/digester';
import style from './demo-model-list.module.scss';
import clsx from 'clsx';
import { fetchRefModelIndex } from '../ref-models';

export const DemoModelList: React.FC<{ onPick?(): void }> = (props) => {
  const [files, setFiles] = useState<VoxFileDigest[]>([]);

  useEffect(() => {
    fetchRefModelIndex().then(setFiles);
  }, []);

  return (
    <table className={clsx('text-lg', style.listTable)}>
      <thead>
        <tr>
          <th>path</th>
          <th>models</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file, fileIndex) => (
          <tr className="border-white" key={file.path}>
            <td>{file.path}</td>
            <td>
              <ModelPickerCell file={file} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
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
