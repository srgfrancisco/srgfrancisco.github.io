// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://sergiofrancisco.com',
  integrations: [sitemap({ filter: (page) => !page.includes('/og-card') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
