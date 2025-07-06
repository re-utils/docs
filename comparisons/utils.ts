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

export const toByte = (num: number) =>
  num >= 1e6
    ? +(num / 1e6).toFixed(2) + 'MB'
    : num >= 1e3
      ? +(num / 1e3).toFixed(2) + 'KB'
      : num + 'B';
export const formatSecond = (num: number) => num >= 1
  ? +num.toFixed(2) + 's'
  : num >= 1e-3
    ? +(num * 1e3).toFixed(2) + 'ms'
    : num >= 1e-6
      ? +(num * 1e6).toFixed(2) + 'µs'
      : +(num * 1e9).toFixed(2) + 'ns';

export const stringSize = (str: string) => toByte(Buffer.from(str).byteLength);
export const gzipSize = (str: string) => toByte(Bun.gzipSync(str).byteLength);
export const insertTab = (str: string, spaces: number) => {
  const space = ' '.repeat(spaces);
  return str
    .split('\n')
    .map((line) => space + line)
    .join('\n');
};
