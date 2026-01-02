import { readFile, hash } from './file.ts';
import pLimit from 'p-limit';

const getHash = async (path: string) => hash(await readFile(path));

export const getHashes = (paths: string[]) => {
  // No limit when not needed
  if (paths.length < 10) return Promise.all(paths.map(getHash));

  const limit = pLimit(10);
  return Promise.all(
    paths.map((path) => limit(getHash, path))
  );
}
