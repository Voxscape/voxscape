import React, { useEffect, useState } from 'react';
import { VoxFileDigest } from '@voxscape/vox.ts/src/parser/digester';
import style from './demo-model-list.module.scss';
import clsx from 'clsx';
import { RefModelIndexEntry, fetchRefModelIndex } from './ref-models';
import { RefModelsTable } from './ref-models-table';

export const DemoModelList: React.FC<{ onPick?(): void }> = (props) => {
  const [files, setFiles] = useState<RefModelIndexEntry[]>([]);

  useEffect(() => {
    fetchRefModelIndex().then(setFiles);
  }, []);

  return <RefModelsTable files={files} onClick={(f, i) => props.onPick?.()} />;
};
