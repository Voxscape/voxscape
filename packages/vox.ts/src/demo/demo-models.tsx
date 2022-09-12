import React, { useEffect, useState } from 'react';

interface IndexedModel {}

async function fetchIndexModel(): Promise<IndexedModel[]> {
  const res = await fetch('/ref-models-2/index.txt');
  const resText = await res.text();
  const jsonLines = resText.split('\n').filter((line) => line.startsWith('JSON\t'));
  console.debug('jsonLines', jsonLines);
  return jsonLines.map((line) => JSON.parse(line.slice(5)));
}

export const DemoModelPicker: React.FC<{ onPick?(): void }> = (props) => {
  const [models, setModels] = useState<IndexedModel[]>([]);

  useEffect(() => {
    fetchIndexModel().then(setModels);
  }, []);

  return <div>TODO</div>;
};
