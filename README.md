# srgfrancisco.github.io

Personal site for [sergiofrancisco.com](https://sergiofrancisco.com). Astro,
static, dark-only, zero client-side JavaScript.

```bash
pnpm install
pnpm dev        # local dev server
pnpm build      # static output to dist/
pnpm preview    # serve dist/
```

## Content

Everything readable lives in Markdown under `src/content/`:

- `work/` — one file per role
- `built/` — open source

The Zod schemas in `src/content.config.ts` are deliberately strict, so factual
precision is a build guarantee rather than a matter of discipline:

- `summary` caps at **90 characters**. One line per entry on the home page;
  going over breaks the build before it breaks the layout.
- `verified` is **required** — the date the entry was last fact-checked against
  `career-master.md`. An unverified case does not compile.

Both were confirmed to fail the build on purpose. Do not relax them to make a
build pass; fix the content instead.

Set `draft: true` to keep an entry out of the home page and out of
`getStaticPaths` — that is the escape hatch for publishing with a case still
unfinished, not the schema.

## Deploy

Push to `main` builds and deploys to GitHub Pages via
`.github/workflows/deploy.yml`.

Cutover is two phases. Phase 1 is the site live at `srgfrancisco.github.io`.
**Phase 2 — the apex domain — happens only after visual approval:** add
`public/CNAME` containing `sergiofrancisco.com`, point the apex A records at
`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`, CNAME `www` to
`srgfrancisco.github.io`, and enable *Enforce HTTPS* in the repo settings. The
Hashnode posts come down at that moment.

`astro.config.mjs` already sets `site` to the final domain so OG tags and the
sitemap are correct from phase 1.

## Open items

- **The "Book a call" CTA is a placeholder** (`src/site.ts`). It currently falls
  back to a `mailto:`. It needs a Google Calendar *appointment schedule* on
  `email@sergiofrancisco.com`, which can only be created through the Calendar
  UI — there is no API for it. Replace `site.booking` and drop
  `bookingIsPlaceholder` once the public booking URL exists.
