// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

/**
 * @param {string} prefix
 * @param {string[]} items
 */
const createItem = (prefix, items, label = prefix) => ({
  label,
  items: items.map((item) => ({
    label: item,
    slug: prefix.toLowerCase() + "/" + item.toLowerCase().replaceAll(" ", "-"),
  })),
});

const PAGES = [
  {
    name: "guides",
    label: "Guides",
    items: ["Intro", "Libraries"],
  },
  {
    name: "concurrency",
    label: "Concurrency",
    items: ["References", "Sleep", "Yield", "Semaphore", 'Signal', 'Comparisons'],
  },
  {
    name: "di",
    label: "Dependency Injection",
    items: ["References", "Using services", "Provide implementations"],
  },
  {
    name: "backend",
    label: "Backend",
    items: ["References", "Routing"],
  },
];

// https://astro.build/config
export default defineConfig({
  redirects: Object.fromEntries(
    PAGES.map((page) => ["/" + page.name, "/" + page.name + "/references"]),
  ),
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  integrations: [
    starlight({
      title: "r-u",
      editLink: {
        baseUrl: "https://github.com/re-utils/docs/edit/main",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "//github.com/re-utils",
        },
        {
          icon: "discord",
          label: "Discord",
          href: "//discord.gg/za6S2GbK24",
        },
      ],
      sidebar: PAGES.map((page) =>
        createItem(page.name, page.items, page.label),
      ),
      expressiveCode: {
        themes: ["catppuccin-mocha"],
      },
      customCss: ["./src/styles/globals.css"],
    }),
  ],
});
