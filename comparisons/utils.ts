import { join } from 'node:path/posix';

export interface TTest {
  title: string;
  description: string;
  code: Record<string, string>;
}

export interface TCategory {
  output: string;
  description: string;
  list: TTest[];
}

export const category = <T extends TCategory>(t: T): T => t;
export const test = <T extends TTest>(t: T): T => t;

export const EXT = '.ts';
export const readDir = <const T extends string[]>(
  dir: string,
  item: T,
): Record<T[number], string> => {
  const o = {};
  // @ts-ignore
  for (const name of item) o[name] = join(dir, name + '.ts');
  return o as any;
};
