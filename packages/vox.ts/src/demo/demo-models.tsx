import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@blueprintjs/core';

interface IndexedFile {
  path: string;
  modelCount: number;
  modelMeta: {
    x: number;
    y: number;
    z: number;
    numVoxel: number;
  }[];
}

async function fetchIndex(): Promise<IndexedFile[]> {
  const res = await fetch('/ref-models-2/index.txt');
  const resText = await res.text();
  const jsonLines = resText.split('\n').filter((line) => line.startsWith('JSON\t'));
  console.debug('jsonLines', jsonLines);
  return jsonLines.map((line) => JSON.parse(line.slice(5)));
}

export const DemoModelPicker: React.FC<{ onPick?(): void }> = (props) => {
  const [files, setFiles] = useState<IndexedFile[]>([]);

  useEffect(() => {
    fetchIndex().then(setFiles);
  }, []);

  return (
    <table className="text-lg">
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

const ModelPickerCell: React.FC<{ file: IndexedFile }> = ({ file }) => {
  const onOpenViewer = (modelIndex: number) => {
    window.open(`/demo/babylon-viewer?file=${encodeURIComponent(file.path)}&modelId=${modelIndex}`, '_blank');
  };
  return (
    <div>
      {file.modelMeta.map((m, modelIndex) => (
        <div key={modelIndex}>
          model#{modelIndex}: {m.x}x{m.y}x{m.z}, {m.numVoxel} voxels
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
