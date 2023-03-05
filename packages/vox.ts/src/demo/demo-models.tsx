import React, { useEffect, useState } from 'react';
import { Button } from '@blueprintjs/core';
import { VoxFileDigest } from '../parser/digester';

async function fetchIndex(): Promise<VoxFileDigest[]> {
  const res = await fetch('/ref-models-2/index.txt');
  const resText = await res.text();
  const jsonLines = resText.split('\n').filter((line) => line.startsWith('{'));
  console.debug('jsonLines', jsonLines);
  return jsonLines.map((line) => JSON.parse(line));
}

export const DemoModelPicker: React.FC<{ onPick?(): void }> = (props) => {
  const [files, setFiles] = useState<VoxFileDigest[]>([]);

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

const ModelPickerCell: React.FC<{ file: VoxFileDigest }> = ({ file }) => {
  const onOpenViewer = (modelIndex: number) => {
    window.open(`/demo/babylon-viewer?file=${encodeURIComponent(file.path)}&modelId=${modelIndex}`, '_blank');
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
