import { readFile, hash } from './file.ts';
import { semaphore } from 'ciorent';

const getHash = async (path: string) => hash(await readFile(path));

export const getHashes = (paths: string[]) => {
  // No limit when not needed
  if (paths.length < 10) return Promise.all(paths.map(getHash));

  const sem = semaphore.init(10, paths.length - 10);
  return Promise.all(
    paths.map((path) => semaphore.run(sem, getHash, path))
  );
}
