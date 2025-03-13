import { Dirent } from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { digestFile, VoxFileDigest } from '../parser/digester';
import { basicParser } from '../parser/basic-parser';

async function main() {
  const indexEntry: (VoxFileDigest & { downloadPath: string })[] = [];
  const refModelRoot = path.join(__dirname, '../../../../ref-models/vox');
  const redirectedRoot = path.join(__dirname, '../../../../ref-models/vox/_by_hash');
  for (const f of await fsp.readdir(refModelRoot, { withFileTypes: true, recursive: true })) {
    if (!(f.isFile() && /\.vox$/.test(f.name) && !/_by_hash/.test(f.path))) {
      continue;
    }
    const origPath = path.join(f.path, f.name);
    const bytes = await fsp.readFile(origPath);
    const md5 = crypto.createHash('md5').update(bytes).digest('hex');

    const parsed = basicParser(bytes.buffer);
    const d = digestFile(f.path, parsed);

    const newFilename = `${md5}.vox`;
    const newPath = path.join(redirectedRoot, newFilename);
    await fsp.cp(origPath, newPath);
    indexEntry.push({
      ...d,
      path: path.relative(refModelRoot, origPath),
      downloadPath: path.relative(refModelRoot, newPath),
    });
  }

  const lines = indexEntry.map((v) => JSON.stringify(v) + '\n');
  await fsp.writeFile(path.join(refModelRoot, 'index.ndjson'), lines);
}

setTimeout(() =>
  main().catch((e) => {
    console.error(e);
  }),
);
