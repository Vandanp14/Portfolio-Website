// Per-route HTML for link previews and crawlers (Vercel Function). The site
// is a client-rendered SPA, so bots that don't run JS would otherwise see
// the home page's meta tags on every URL. vercel.json rewrites /blog,
// /blog/:id, /resume and the section pages here; this fetches the deployment's own index.html
// and swaps in route-specific <title>, description, canonical, Open Graph,
// Twitter and JSON-LD. The SPA then boots as normal.
//
//   GET /api/page?path=/blog        → blog index meta + Blog JSON-LD
//   GET /api/page?path=/blog/ID     → post meta + BlogPosting JSON-LD (404 if unknown)
//   GET /api/page?path=/resume      → résumé meta
//   GET /api/page?path=/work etc.   → section page meta (/work, /experience, /about, /contact)
//   anything else                   → 404 + noindex (the SPA renders NotFound)

import { fetchIndex, fetchPost, isoDate, POST_ID } from './_lib/blog.js';
import { escapeHtml, excerptFromHtml, readingMinutes, wordCount } from './_lib/html.js';
import {
  BLOG_DESCRIPTION,
  BLOG_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  ORIGIN,
  SECTION_PAGES,
  SITE_NAME,
  ogImageUrl,
} from './_lib/site.js';

declare const process: { env: Record<string, string | undefined>; cwd(): string };

const CACHED = 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400';
const SHORT = 'public, max-age=0, s-maxage=60';

type Meta = {
  title: string;
  description: string;
  path: string;
  type: 'website' | 'article';
  image: string;
  imageAlt: string;
  noindex?: boolean;
  publishedTime?: string;
  jsonLd?: Record<string, unknown>;
};

const AUTHOR = { '@type': 'Person', name: SITE_NAME, url: `${ORIGIN}/` };

/**
 * Where to fetch index.html from when the bundled copy is unavailable. Never
 * derived from request headers: Host / X-Forwarded-Host are client-supplied,
 * and trusting them would let a request point this fetch (and the bypass
 * secret) at another server and get its HTML cached under our URL.
 *   - On Vercel: the deployment's own URL from the platform env.
 *   - Under `npm run dev`: the local Vite server, only when Host is loopback.
 */
function shellOrigin(request: Request): string | null {
  // vercel dev sets VERCEL_URL to `localhost:3001` (no scheme), so the request
  // host is the reliable source for local development.
  const host = request.headers.get('host') ?? '';
  if (/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)) return `http://${host}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return null;
}

type Fs = { readFile(path: string, encoding: 'utf8'): Promise<string> };

/**
 * The built index.html. The copy bundled into the function via vercel.json
 * `includeFiles` comes first (no network, always this deployment's build);
 * otherwise it's fetched from this deployment, which is also how
 * `npm run dev` gets Vite's live index.html.
 */
async function loadShell(request: Request): Promise<string | null> {
  if (process.env.VERCEL) {
    try {
      // Non-literal specifier: api/ has no Node typings, and fs is a builtin.
      const specifier = 'node:fs/promises';
      const fs = (await import(specifier)) as Fs;
      const html = await fs.readFile(`${process.cwd()}/dist/index.html`, 'utf8');
      if (/<\/head>/i.test(html)) return html;
    } catch {
      // fall through to fetching it
    }
  }

  const origin = shellOrigin(request);
  if (!origin) return null;
  try {
    const headers: Record<string, string> = {};
    // Only ever sent to this deployment's own URL (see shellOrigin).
    if (process.env.VERCEL_URL && process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
      headers['x-vercel-protection-bypass'] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    }
    const response = await fetch(new URL('/index.html', origin), { cache: 'no-store', headers, redirect: 'error' });
    if (!response.ok) return null;
    const html = await response.text();
    return /<\/head>/i.test(html) ? html : null;
  } catch {
    return null;
  }
}

function render(shell: string, meta: Meta): string {
  const url = `${ORIGIN}${meta.path}`;
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    meta.noindex ? '<meta name="robots" content="noindex" />' : '',
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:image" content="${escapeHtml(meta.image)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${escapeHtml(meta.imageAlt)}" />`,
    meta.publishedTime ? `<meta property="article:published_time" content="${meta.publishedTime}" />` : '',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />`,
    meta.jsonLd
      ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`
      : '',
  ]
    .filter(Boolean)
    .map((tag) => `    ${tag}`)
    .join('\n');

  const stripped = shell
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name="description"[\s\S]*?\/?>/gi, '')
    .replace(/\s*<meta\s+name="robots"[\s\S]*?\/?>/gi, '')
    .replace(/\s*<link\s+rel="canonical"[\s\S]*?\/?>/gi, '')
    .replace(/\s*<meta\s+property="(?:og|article):[\s\S]*?\/?>/gi, '')
    .replace(/\s*<meta\s+name="twitter:[\s\S]*?\/?>/gi, '');
  return stripped.replace(/<\/head>/i, `${tags}\n  </head>`);
}

function generic(path: string, overrides: Partial<Meta> = {}): Meta {
  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path,
    type: 'website',
    image: ogImageUrl(),
    imageAlt: `${SITE_NAME} — Software Engineer`,
    ...overrides,
  };
}

async function resolve(path: string): Promise<{ meta: Meta; status: number; cache: string }> {
  if (path === '/blog') {
    const index = await fetchIndex();
    const description = BLOG_DESCRIPTION;
    const title = BLOG_TITLE;
    return {
      status: 200,
      cache: CACHED,
      meta: generic('/blog', {
        title,
        description,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: title,
          description,
          url: `${ORIGIN}/blog`,
          author: AUTHOR,
          ...(index.ok && {
            blogPost: index.data.posts.slice(0, 20).map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              url: `${ORIGIN}/blog/${post.id}`,
              ...(isoDate(post.date) && { datePublished: isoDate(post.date) }),
            })),
          }),
        },
      }),
    };
  }

  const section = SECTION_PAGES[path];
  if (section) {
    return {
      status: 200,
      cache: CACHED,
      meta: generic(path, { title: `${section.title} — ${SITE_NAME}`, description: section.description }),
    };
  }

  if (path === '/resume') {
    return {
      status: 200,
      cache: CACHED,
      meta: generic('/resume', {
        title: `Résumé — ${SITE_NAME}`,
        description: `${SITE_NAME}'s résumé: backend and distributed systems, Software Engineering Intern at Fanatics, CS at SUNY Oswego.`,
      }),
    };
  }

  const post = path.match(/^\/blog\/([^/]+)$/);
  if (post && POST_ID.test(post[1])) {
    const id = post[1];
    const result = await fetchPost(id);
    if (!result.ok) {
      return result.notFound
        ? {
            status: 404,
            cache: SHORT,
            meta: generic(path, { title: `Post not found — ${SITE_NAME}`, noindex: true }),
          }
        : { status: 200, cache: SHORT, meta: generic(path) };
    }

    const { title, date, html } = result.data;
    const minutes = readingMinutes(html);
    const published = isoDate(date) ?? undefined;
    const description = excerptFromHtml(html, 200) || `${title} — writing by ${SITE_NAME}.`;
    const image = ogImageUrl({ title, ...(published && { date: published }), min: minutes });
    const url = `${ORIGIN}${path}`;
    return {
      status: 200,
      cache: CACHED,
      meta: {
        title: `${title} — ${SITE_NAME}`,
        description,
        path,
        type: 'article',
        image,
        imageAlt: title,
        publishedTime: published,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description,
          url,
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          image,
          author: AUTHOR,
          publisher: AUTHOR,
          wordCount: wordCount(html),
          ...(published && { datePublished: published, dateModified: published }),
        },
      },
    };
  }

  return { status: 404, cache: SHORT, meta: generic(path, { title: `Page not found — ${SITE_NAME}`, noindex: true }) };
}

export async function GET(request: Request): Promise<Response> {
  const raw = new URL(request.url).searchParams.get('path') ?? '/';
  // Normalize a trailing slash so /blog/ and /blog share one canonical.
  const path = raw.length > 1 ? raw.replace(/\/+$/, '') : raw;

  const shell = await loadShell(request);
  if (!shell) {
    return new Response('Service unavailable', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const { meta, status, cache } = await resolve(path);
  return new Response(render(shell, meta), {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': cache },
  });
}
