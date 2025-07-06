import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path/posix';

import { build } from 'rolldown';
import { minify } from 'oxc-minify';

import { EXT, type TCategory, type TTest } from './utils.js';

const toByte = (num: number) =>
  num >= 1e6
    ? +(num / 1e6).toFixed(2) + 'MB'
    : num >= 1e3
      ? +(num / 1e3).toFixed(2) + 'KB'
      : num + 'B';

const size = (str: string) => toByte(Buffer.from(str).byteLength);
const gzipSize = (str: string) => toByte(Bun.gzipSync(str).byteLength);

const reportSize = async (path: string) => {
  const outputFile = path.slice(0, -EXT.length) + '.bundled.js';

  const out = await build({
    input: path,
    output: {
      file: outputFile,
    },
  });

  const code = out.output[0].code;
  const minifiedCode = minify(path, code).code!;

  return {
    'Bundled': size(code),
    'Minified': size(minifiedCode),
    'Gzipped': gzipSize(minifiedCode)
  };
};

const tab = (str: string, spaces: number) => {
  const space = ' '.repeat(spaces);
  return str
    .split('\n')
    .map((line) => space + line)
    .join('\n');
};

let currentID = 0;
const processTest = async (c: TTest) => {
  const processed = Object.entries(c.code).map(async ([key, path]) => {
    const stats = await reportSize(path);
    const tabItem =
      Object.entries(stats)
        .map(([key, value]) => `- ${key}: **\`${value}\`**\n`)
        .join('') +
      '```ts\n' +
      (await readFile(path, 'utf8')).trim() +
      '\n```';

    return `  <TabItem label="${key}">\n${tab(tabItem, 4)}\n  </TabItem>`;
  });

  return `## ${c.title}
${c.description}
<Tabs syncKey="libComparison${currentID++}">
${(await Promise.all(processed)).join('\n')}
</Tabs>
`;
};

export const processCategory = async (c: TCategory) => {
  const res =
    `---
title: Comparisons
description: ${c.description}
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

${c.description}

` + (await Promise.all(c.list.map(processTest))).join('\n\n');

  return Bun.write(
    resolve(import.meta.dir, '../src/content/docs', c.output + '.mdx'),
    res,
  );
};

import di from './di/index.js';

processCategory(di).then(console.log);
