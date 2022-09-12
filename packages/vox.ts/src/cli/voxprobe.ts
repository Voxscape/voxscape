import fsp from 'node:fs/promises';
import { basicParser } from '../parser/basic-parser';

function printTsv(...columns: (string | number)[]) {
  console.log(columns.join('\t'));
}
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
      printTsv('FILE', arg, bytes.byteLength, parsed.models.length, parsed.materials.length);
      printTsv(
        'JSON',
        JSON.stringify({
          path: arg,
          modelCount: parsed.models.length,
          modelMeta: parsed.models.map((m) => ({ ...m.size, numVoxel: m.voxels.length })),
        }),
      );
      for (const [modelId, model] of parsed.models.entries()) {
        printTsv('MODEL', modelId, model.voxels.length, model.size.x, model.size.y, model.size.z);
      }
    } catch (e: any) {
      console.error(arg, e);
      printTsv('ERROR', arg, e?.message);
    }
  }
}

setTimeout(() => main(...process.argv.slice(2)));
