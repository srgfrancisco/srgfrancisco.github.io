import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Projects, not employers. The site positions Sérgio as the contractor who
 * delivered the work, so the client is the headline and the company that held
 * the contract is a footnote (`deliveredVia`).
 *
 * The schema is the mechanism that turns factual precision into a build
 * guarantee instead of discipline. A missing or malformed field breaks
 * `astro build` before it breaks the page.
 *
 * Two rules are deliberate and must not be relaxed to make a build pass:
 * - `summary` caps at 90 characters, forcing one line per project on the home.
 * - `verified` is required: a project with no fact-check date does not compile.
 *
 * `years` is optional on purpose. Several engagements cannot be dated more
 * precisely than the contract window without guessing, and an invented date is
 * worse than an empty column.
 */
/**
 * Filename of the client's logo inside `src/assets/clients`, drawn on the
 * Upwork portfolio thumbnail. Optional, and expected to stay that way for
 * some entries: `upwork-card.ts` falls back to a monogram built from the
 * client name, so a missing logo is a quieter card rather than a broken one.
 *
 * This is the one field here that points at a third-party trademark, so it is
 * deliberately explicit per project rather than guessed from the client name.
 */
const clientLogo = z.string().regex(/^[a-z0-9-]+\.(svg|png)$/);

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    client: z.string(),
    title: z.string(),
    summary: z.string().max(90),
    role: z.string(),
    /** Company that held the contract, where it was not direct. */
    deliveredVia: z.string().optional(),
    years: z
      .string()
      .regex(/^\d{4}(–\d{4})?$/, 'expected YYYY or YYYY–YYYY (en dash)')
      .optional(),
    stack: z.array(z.string()).min(1),
    logo: clientLogo.optional(),
    order: z.number(),
    verified: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const built = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/built' }),
  schema: z.object({
    name: z.string(),
    repo: z.string().url(),
    pypi: z.string().url().optional(),
    license: z.string(),
    summary: z.string().max(90),
    stack: z.array(z.string()).min(1),
    logo: clientLogo.optional(),
    verified: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, built };
