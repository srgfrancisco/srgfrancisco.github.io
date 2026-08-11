import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const period = z.string().regex(/^\d{4}-\d{2}$/, 'expected YYYY-MM');

/**
 * The schema is the mechanism that turns factual precision into a build
 * guarantee instead of discipline. A missing or malformed field breaks
 * `astro build` before it breaks the page.
 *
 * Two rules are deliberate and must not be relaxed to make a build pass:
 * - `summary` caps at 90 characters, forcing one line per case on the home.
 * - `verified` is required: a case with no fact-check date does not compile.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/work' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    periodStart: period,
    periodEnd: period.or(z.literal('present')),
    summary: z.string().max(90),
    stack: z.array(z.string()).min(1),
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
    verified: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, built };
