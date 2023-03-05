import fsp from 'node:fs/promises';
import { basicParser } from '../parser/basic-parser';

async function main(...args: string[]): Promise<void> {
  if (!args.length) {
    console.log(`Usage: voxprobe <vox-file>`);
    return;
  }

  for (const arg of args) {
    console.debug('DEBUG reading', arg);
    const bytes = await fsp.readFile(arg);
    try {
      const parsed = basicParser(bytes.buffer);
      const f = {
        path: arg,
        models: parsed.models.map((m) => ({
          size: m.size,
          numVoxels: m.voxels.length,
        })),
      };
      console.log(JSON.stringify(f));
    } catch (e: any) {
      console.error(arg, e);
    }
  }
}

setTimeout(() => main(...process.argv.slice(2)));
