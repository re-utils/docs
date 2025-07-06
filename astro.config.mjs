// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

/**
 * @param {string} prefix
 * @param {string[]} items
 */
const createItem = (prefix, items, label = prefix) => ({
  label,
  items: items.map((item) => ({
    label: item,
    slug: prefix.toLowerCase() + '/' + item.toLowerCase().replaceAll(' ', '-'),
  })),
});

// https://astro.build/config
export default defineConfig({
  redirects: Object.fromEntries(
    ['/concurrency', '/di'].map((link) => [link, link + '/references']),
  ),
  integrations: [
    starlight({
      title: 'r-u',
      editLink: {
        baseUrl: 'https://github.com/re-utils/docs/edit/main',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: '//github.com/re-utils',
        },
        {
          icon: 'discord',
          label: 'Discord',
          href: '//discord.gg/za6S2GbK24',
        },
      ],
      sidebar: [
        createItem('Guides', ['Intro', 'Libraries']),
        createItem('Concurrency', [
          'References',
          'Sleep',
          'Yield',
          'Semaphore',
          'Latch',
        ]),
        createItem(
          'di',
          [
            'References',
            'Using services',
            'Provide implementations',
            'Comparisons',
          ],
          'Dependency Injection',
        ),
      ],
      expressiveCode: {
        themes: ['catppuccin-mocha'],
      },
      customCss: [
        '@fontsource-variable/roboto-mono',
        './src/styles/globals.css',
      ],
    }),
  ],
});
