import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import {
  renderUpworkThumb,
  type UpworkCardContent,
} from '../../lib/upwork-card';

/**
 * One 1000x750 thumbnail per case study and per open-source project, at
 * `/upwork/<page-slug>.png`. Slugs mirror `/og/<page-slug>.png` and
 * `/thumb/<page-slug>.png`, so every rendering of the same project stays
 * addressable the same way.
 *
 * Unlike the other two, this one does not take `CardContent`: the copy that
 * survives Upwork's 216px grid tile is its own pair of fields on the entry.
 * The fallback for an entry without them keeps the build green — the lead
 * technology and the first words of the title — but it repeats the caption
 * Upwork already prints, so it is a stopgap rather than a default worth
 * relying on.
 */
const fallback = (stack: string[], title: string) => ({
  mark: stack[0],
  line: title.split(' ').slice(0, 4).join(' '),
});

export const getStaticPaths = (async () => {
  const [projects, built] = await Promise.all([
    getCollection('projects', ({ data }) => !data.draft),
    getCollection('built', ({ data }) => !data.draft),
  ]);

  return [
    ...projects.map((entry) => ({
      params: { slug: `case-${entry.id}` },
      props: {
        card: {
          ...(entry.data.upwork ??
            fallback(entry.data.stack, entry.data.title)),
          eyebrow: entry.data.client,
          years: entry.data.years,
        } satisfies UpworkCardContent,
      },
    })),
    ...built.map((entry) => ({
      params: { slug: `built-${entry.id}` },
      props: {
        card: {
          ...(entry.data.upwork ?? fallback(entry.data.stack, entry.data.name)),
          eyebrow: 'Open source',
        } satisfies UpworkCardContent,
      },
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderUpworkThumb(props.card as UpworkCardContent);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
