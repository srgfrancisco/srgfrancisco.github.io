import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import type { CardContent } from '../../lib/og-card';
import { renderUpworkThumb } from '../../lib/upwork-card';

/**
 * One 1000x750 thumbnail per case study and per open-source project, at
 * `/upwork/<page-slug>.png`. Slugs mirror `/og/<page-slug>.png` and
 * `/thumb/<page-slug>.png`, so every rendering of the same project stays
 * addressable the same way.
 *
 * 1000x750 is the size an Upwork portfolio item's image is rendered at.
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
  const png = await renderUpworkThumb(props.card as CardContent);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
