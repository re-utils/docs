import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path/posix';

import { build } from 'rolldown';
import { minify } from 'oxc-minify';

import {
  EXT,
  gzipSize,
  insertTab,
  stringSize,
  type TCategory,
  type TTest,
} from './utils.js';

const report = async (path: string) => {
  const outputFile = path.slice(0, -EXT.length);
  const outputBundle = outputFile + '.bundled.js';

  const out = await build({
    input: path,
    external: /^node:.*$/,
    output: {
      format: 'es',
      file: outputBundle,
    },
  });

  const code = out.output[0].code;
  const minifiedCode = minify(path, code, {
    mangle: {
      toplevel: true,
    },
  }).code!;
  await Bun.write(outputBundle, minifiedCode);

  return {
    'Bundle size': stringSize(code),
    'Minified size': stringSize(minifiedCode),
    'Gzipped size': gzipSize(minifiedCode),
  };
};

const processTest = async (c: TTest) => {
  const entries = Object.entries(c.code);

  // Process each items
  const processed = entries.map(async ([key, path]) => {
    const stats = await report(path);

    const tabItem =
      Object.entries(stats)
        .map(([key, value]) => `- ${key}: **${value}**\n`)
        .join('') +
      '```ts\n' +
      (await readFile(path, 'utf8')).trim() +
      '\n```';

    return `  <TabItem label='${key}'>\n${insertTab(tabItem, 4)}\n  </TabItem>`;
  });

  return `## ${c.title}
${c.description}
<Tabs>
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
import concurrency from './concurrency/index.js';
await Promise.all([di, concurrency].map(processCategory));
