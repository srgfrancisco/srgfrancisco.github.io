import type { APIRoute } from 'astro';

/*
 * The Hashnode site served its sitemap at /sitemap.xml and Google still crawls
 * that URL, where @astrojs/sitemap emits /sitemap-index.xml. Search Console
 * reports the miss as a 404. A meta-refresh stub is no use here: the crawler
 * fetches this as XML and never renders HTML, so mirror the index instead.
 *
 * It stays a mirror of whatever the integration emits — one <loc> per sitemap
 * file. A second file only appears past 45,000 URLs, which this site will not
 * reach; if it ever does, this list has to grow with it.
 */
export const GET: APIRoute = ({ site }) => {
  const loc = new URL('sitemap-0.xml', site).href;

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${loc}</loc></sitemap></sitemapindex>`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
};
