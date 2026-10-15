// XML sitemap (Vercel Function), served at /sitemap.xml via a vercel.json
// rewrite. Static pages are always listed; blog posts come from the Apps
// Script index, so a blog outage still yields a valid (shorter) sitemap.
//
//   GET /api/sitemap → urlset   (CDN 1h, stale for a day)

import { fetchIndex, isoDate } from './_lib/blog.js';
import { escapeXml } from './_lib/html.js';
import { ORIGIN } from './_lib/site.js';

export async function GET(): Promise<Response> {
  const urls: { loc: string; lastmod?: string }[] = [{ loc: `${ORIGIN}/` }, { loc: `${ORIGIN}/blog` }, { loc: `${ORIGIN}/resume` }];

  const index = await fetchIndex();
  if (index.ok) {
    for (const post of index.data.posts) {
      urls.push({ loc: `${ORIGIN}/blog/${post.id}`, lastmod: isoDate(post.date) ?? undefined });
    }
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      ({ loc, lastmod }) =>
        `  <url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
    ),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // A partial sitemap (blog down) shouldn't stick around for an hour.
      'Cache-Control': index.ok
        ? 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
        : 'public, max-age=0, s-maxage=60',
    },
  });
}
