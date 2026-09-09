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
 * Copy for the Upwork portfolio thumbnail, which is a different problem from
 * the other two card surfaces. Upwork renders the image at 216x173 in the
 * profile grid and never larger than 236x189 anywhere — measured on the live
 * profile, not assumed — so about a fifth of the drawn size survives. Only two
 * pieces of text can be read at that scale, and the project name is already
 * printed as a caption directly under the tile.
 *
 * Both fields are copy rather than fact, so neither carries the `verified`
 * contract the rest of the schema enforces. They are optional: `upwork-card.ts`
 * falls back to the stack and the title, which is legible but repeats the
 * caption and puts the same word on eight AWS cards at once.
 */
const upworkCard = z.object({
  /** The headline technology, drawn very large. Keep it under ~15 characters. */
  mark: z.string().max(20),
  /** Two to four words for what was done. Not the title — the caption has it. */
  line: z.string().max(32),
});

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
    upwork: upworkCard.optional(),
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
    upwork: upworkCard.optional(),
    verified: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, built };
