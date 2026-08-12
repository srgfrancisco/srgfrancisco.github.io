import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderCard, type CardContent } from '../../lib/og-card';

/**
 * One social card per case study and per open-source project, at
 * `/og/<page-slug>.png` — the slug mirrors the page route it belongs to, so
 * `/case-kojo-ci-migration` is advertised by `/og/case-kojo-ci-migration.png`.
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
  const png = await renderCard(props.card as CardContent);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
