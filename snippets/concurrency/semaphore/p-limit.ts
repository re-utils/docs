import { readFile, hash } from './file.ts';
import { limitFunction } from 'p-limit';

const getHash = async (path: string) => hash(await readFile(path));

export const getHashes = (paths: string[]) => {
  // No limit when not needed
  if (paths.length < 10) return Promise.all(paths.map(getHash));

  return Promise.all(
    paths.map(limitFunction(getHash, { concurrency: 10 }))
  );
}
