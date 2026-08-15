import type { APIRoute, GetStaticPaths } from 'astro';
import { coverSizes, renderCover } from '../../lib/cover-banner';

/**
 * Profile cover banners at `/cover/<slug>.png`, one per platform header size.
 * Slugs and dimensions live in `coverSizes`.
 */
export const getStaticPaths = (() =>
  Object.entries(coverSizes).map(([slug, size]) => ({
    params: { slug },
    props: { size },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderCover(props.size as (typeof coverSizes)[string]);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
