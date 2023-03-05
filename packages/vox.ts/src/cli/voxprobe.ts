import fsp from 'node:fs/promises';
import { basicParser } from '../parser/basic-parser';
import { digestFile } from '../parser/digester';

async function main(...args: string[]): Promise<void> {
  if (!args.length) {
    console.log(`Usage: voxprobe <vox-file>`);
    return;
  }

  for (const arg of args) {
    const bytes = await fsp.readFile(arg);
    try {
      const parsed = basicParser(bytes.buffer);
      const d = digestFile(arg, parsed);
      console.log(JSON.stringify(d));
    } catch (e: any) {
      console.error(arg, e);
    }
  }
}

setTimeout(() => main(...process.argv.slice(2)));
