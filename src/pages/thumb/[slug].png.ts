import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import type { CardContent } from '../../lib/og-card';
import { renderThumb } from '../../lib/thumb-card';

/**
 * One 336x164 thumbnail per case study and per open-source project, at
 * `/thumb/<page-slug>.png`. Slugs mirror `/og/<page-slug>.png` so the two
 * renderings of the same project stay addressable the same way.
 *
 * These exist for profile surfaces that ask for a small project image, such as
 * the Braintrust portfolio, where the alternative is an unrelated stock logo.
 */
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
          eyebrow: entry.data.client,
          title: entry.data.title,
          summary: entry.data.summary,
          years: entry.data.years,
          stack: entry.data.stack,
        } satisfies CardContent,
      },
    })),
    ...built.map((entry) => ({
      params: { slug: `built-${entry.id}` },
      props: {
        card: {
          eyebrow: 'Open source',
          title: entry.data.name,
          summary: entry.data.summary,
          stack: entry.data.stack,
        } satisfies CardContent,
      },
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderThumb(props.card as CardContent);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
