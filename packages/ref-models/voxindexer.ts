import path from 'node:path';
import fsp from 'node:fs/promises';
import * as nodeFind from 'node-find';
import { basicParser } from '@voxscape/vox.ts/src/parser/basic-parser';

async function main(start: string) {
  if (!start) {
    throw new Error(`usage: ${path.basename(__filename)} <start>`);
  }

  const finder = nodeFind.find(nodeFind.and(nodeFind.name('*.vox'), nodeFind.type('f')), { start });
  for await (const child of finder) {
    const steps = child.steps && path.join(...child.steps);

    const buffer = await fsp.readFile(steps);

    const parsed = basicParser(buffer.buffer, false, true);
    console.debug('steps', steps, buffer.byteLength);
  }
}

setTimeout(() => main(process.argv[2]));
