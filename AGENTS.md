## Stack

Astro 7 + Tailwind 4, static output, deployed to GitHub Pages. pnpm only —
CI resolves `pnpm-lock.yaml`. Node 22+ (`engines`); CI pins 24.

## Development

When starting the dev server, use background mode:

```
pnpm dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

There is no test or lint script: `pnpm build` is the verification gate. Run it
before claiming a change works. PRs run no checks — only pushes to `main` trigger
a workflow — so the local build is the whole gate. Commits are GPG-signed: use
`git commit -S`.

## Social cards and thumbnails

`src/lib/og-card.ts` (1200x630) and `thumb-card.ts` (336x164) render satori+sharp
images at `/og/<slug>.png` and `/thumb/<slug>.png`, from the same content
collections as the pages. Fix a title in the Markdown and both follow. The
thumbnails exist for profile surfaces that ask for a small project image.

## Content

Projects and tools are Markdown in `src/content/{projects,built}`, typed by
`src/content.config.ts`. The schema is a fact-check mechanism, not ceremony:
`summary` caps at 90 characters and `verified` (a fact-check date) is required.
Never relax either to make a build pass.

## Redirect stubs

Pre-cutover URLs (`/resume`, `/archive`, `/calendar`, …) are pages built on
`src/layouts/Redirect.astro`. Adding one takes two edits: the page, **and** the
path in the sitemap `filter` in `astro.config.mjs` — otherwise the noindex stub
ships in the sitemap.

## Links

`src/site.ts` is the single source for contact, booking and profile URLs. Change
the link there, not in the pages.

## Deploy

Push to `main` runs `.github/workflows/deploy.yml`. `public/CNAME` holds the apex
domain.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
