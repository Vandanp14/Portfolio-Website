// RSS 2.0 feed of the blog (Vercel Function), served at /rss.xml via a
// vercel.json rewrite. The Apps Script index has no excerpts, so the newest
// posts are fetched (a few at a time) to build each item's description.
//
//   GET /api/rss → rss   (CDN 1h, stale for a day)

import { fetchIndex, fetchPost, isoDate, mapLimit } from './_lib/blog.js';
import { escapeXml, excerptFromHtml, readingMinutes } from './_lib/html.js';
import { BLOG_DESCRIPTION, BLOG_TITLE, ORIGIN } from './_lib/site.js';

const MAX_ITEMS = 20;
const CONCURRENCY = 3;

export async function GET(): Promise<Response> {
  const index = await fetchIndex();
  if (!index.ok) {
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<error>${escapeXml(index.error)}</error>\n`, {
      status: 502,
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const posts = index.data.posts.slice(0, MAX_ITEMS);
  const details = await mapLimit(posts, CONCURRENCY, (post) => fetchPost(post.id));

  const items = posts.map((post, i) => {
    const result = details[i];
    const link = `${ORIGIN}/blog/${post.id}`;
    const iso = isoDate(post.date);
    const description = result.ok
      ? `${excerptFromHtml(result.data.html, 280)} · ${readingMinutes(result.data.html)} min read`
      : '';
    return [
      '    <item>',
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
      iso ? `      <pubDate>${new Date(iso).toUTCString()}</pubDate>` : '',
      description ? `      <description>${escapeXml(description)}</description>` : '',
      '    </item>',
    ]
      .filter(Boolean)
      .join('\n');
  });

  const title = BLOG_TITLE;
  const newest = posts.map((post) => isoDate(post.date)).find(Boolean);
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${ORIGIN}/blog</link>`,
    `    <description>${escapeXml(BLOG_DESCRIPTION)}</description>`,
    '    <language>en-us</language>',
    `    <atom:link href="${ORIGIN}/rss.xml" rel="self" type="application/rss+xml" />`,
    newest ? `    <lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>` : '',
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  // Items whose post fetch failed lack a description; keep that brief in cache.
  const complete = details.every((result) => result.ok);
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': complete
        ? 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
        : 'public, max-age=0, s-maxage=60',
    },
  });
}
