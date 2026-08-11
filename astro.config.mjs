// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://sergiofrancisco.com',
  integrations: [
    sitemap({
      // og-card is a rendering source, not a page. The rest are redirect stubs
      // kept alive for the Hashnode cutover and are already marked noindex.
      filter: (page) =>
        ![
          '/og-card',
          '/resume',
          '/archive',
          '/recommendations',
          '/page/',
          '/series/',
        ].some((path) => page.includes(path)),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
