// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { execFileSync } from 'node:child_process';
import { dirname } from 'node:path';

/*
 * When the dev server runs from a git worktree, node_modules still lives in the
 * main checkout, so Vite serves fonts through /@fs paths outside the worktree
 * root and blocks them — webfonts silently fall back to system defaults. Allow
 * the main checkout explicitly. Returns [] outside a repo (e.g. a tarball).
 */
function mainCheckoutRoot() {
  try {
    const gitDir = execFileSync(
      'git',
      ['rev-parse', '--path-format=absolute', '--git-common-dir'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
    return gitDir ? [dirname(gitDir)] : [];
  } catch {
    return [];
  }
}

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
    server: {
      fs: { allow: ['.', ...mainCheckoutRoot()] },
    },
  },
});
