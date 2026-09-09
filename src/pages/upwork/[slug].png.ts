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
          years: entry.data.years,
          logo: entry.data.logo,
          monogramFrom: entry.data.client,
        } satisfies UpworkCardContent,
      },
    })),
    ...built.map((entry) => ({
      params: { slug: `built-${entry.id}` },
      props: {
        card: {
          eyebrow: 'Open source',
          title: entry.data.name,
          logo: entry.data.logo,
          monogramFrom: entry.data.name,
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
