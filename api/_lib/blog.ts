// Server-side client for the blog's Apps Script web app (posts are written in
// Google Docs). Mirrors the parsing in src/lib/blog.ts so the proxy, page
// meta, RSS and sitemap all agree on what a valid post looks like.

declare const process: { env: Record<string, string | undefined> };

const ENDPOINT =
  process.env.BLOG_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycby-Dsv41BX1B_KyLsvKLS31WvP_kpikatGcevOtHRqQGdQbyjsPia_K2bL9snSgF0poSg/exec';

const TIMEOUT_MS = 15000;
export const POST_ID = /^[\w-]+$/;

export type PostSummary = { id: string; title: string; date: string };
export type PostIndex = { title: string; description: string; posts: PostSummary[] };
export type Post = PostSummary & { html: string };

export type BlogResult<T> = { ok: true; data: T } | { ok: false; error: string; notFound?: boolean };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function toSummary(value: unknown): PostSummary | null {
  if (!isRecord(value) || !str(value.id) || !POST_ID.test(str(value.id))) return null;
  return { id: str(value.id), title: str(value.title) || 'Untitled', date: str(value.date) };
}

async function request(params: Record<string, string>): Promise<BlogResult<Record<string, unknown>>> {
  const url = new URL(ENDPOINT);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal, cache: 'no-store' });
    const data: unknown = await response.json().catch(() => null);
    if (!isRecord(data)) return { ok: false, error: 'The blog returned an unexpected response.' };
    if (typeof data.error === 'string' && data.error.trim() !== '') {
      return { ok: false, error: data.error, notFound: /not found/i.test(data.error) };
    }
    if (!response.ok) return { ok: false, error: 'The blog is unavailable right now.' };
    return { ok: true, data };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error && err.name === 'AbortError' ? 'The blog took too long to respond.' : 'The blog is unreachable.',
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchIndex(): Promise<BlogResult<PostIndex>> {
  const result = await request({ api: 'posts' });
  if (!result.ok) return result;
  const posts = Array.isArray(result.data.posts)
    ? result.data.posts.map(toSummary).filter((post): post is PostSummary => post !== null)
    : [];
  return {
    ok: true,
    data: { title: str(result.data.title) || 'Writing', description: str(result.data.description), posts },
  };
}

export async function fetchPost(id: string): Promise<BlogResult<Post>> {
  if (!POST_ID.test(id)) return { ok: false, error: 'That post doesn’t exist.', notFound: true };
  const result = await request({ api: 'post', id });
  if (!result.ok) return result;
  const summary = toSummary(result.data.post);
  if (!summary || !isRecord(result.data.post)) return { ok: false, error: 'That post doesn’t exist.', notFound: true };
  return { ok: true, data: { ...summary, html: str(result.data.post.html) } };
}

/** Maps `items` through `fn` with at most `limit` in flight, preserving order. */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

/** ISO date if `value` parses, else null. */
export function isoDate(value: string): string | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
