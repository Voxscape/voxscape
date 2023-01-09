import path from 'node:path';
import fsp from 'node:fs/promises';
import * as nodeFind from 'node-find';
import { basicParser } from '@voxscape/vox.ts/src/parser/basic-parser';

async function main(start: string) {
  if (!start) {
    throw new Error(`usage: ${path.basename(__filename)} <start>`);
  }

  const finder = nodeFind.find(nodeFind.and(nodeFind.name('*.vox'), nodeFind.type('f')), { start });

  const index: {
    path: string;
    size: number;
    numModels: number;
    numWarnings: number;
  }[] = [];
  for await (const child of finder) {
    const filename = child.steps && path.join(...child.steps);

    const buffer = await fsp.readFile(filename);

    try {
      const parsed = basicParser(buffer.buffer, false, true);
      index.push({
        path: filename,
        size: buffer.byteLength,
        numModels: parsed.models.length,
        numWarnings: parsed.warnings.length,
      });
    } catch (e) {
      console.error(`error parsing ${filename}`, e);
    }

    console.debug('steps', filename, buffer.byteLength);
  }

  await fsp.writeFile('index.json', JSON.stringify(index, null, 2));
}

setTimeout(() => main(process.argv[2]));
