import { promises } from 'fs';
import { join } from 'path';
import glob = require('glob');
import type { IOptions } from 'glob';

const { readFile, stat } = promises;

export interface ZipFilesOptions<T> extends IOptions {
  cwd: string,
  zip: T,
  compression?: 'STORE' | 'DEFLATE';
  compressionOptions?: null | {
    level: number;
  };
}

/**
 * Zip files that are matched by the pattern.
 */
export async function zipFiles<T>(pattern: string, options: ZipFilesOptions<T>) {
  const files = await new Promise<string[]>((resolve, reject) => {
    glob(pattern, options, (err, files) => {
      if (err) {
        return reject(err);
      }

      resolve(files);
    });
  });

  await Promise.all(files.map(f => zipFile(f, options)));

  return options.zip;
}

async function zipFile<T>(name: string, options: ZipFilesOptions<T>) {
  const {
    cwd,
    zip,
    compression,
    compressionOptions,
  } = options;

  const file = join(cwd, name);

  const stats = await stat(file);

  const data = await readFile(file);

  (zip as any).file(name, data, {
    mode: stats.mode,
    date: new Date(stats.mtime),
    compression,
    compressionOptions,
  });
}
