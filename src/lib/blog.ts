// Transport layer for the blog. Posts are written in Google Docs and served as
// JSON by a separate, public, read-only Apps Script web app. Its GET responses
// carry `Access-Control-Allow-Origin: *`, so a plain fetch works — no JSONP.

export const BLOG_ENDPOINT =
  (import.meta.env.VITE_BLOG_ENDPOINT as string | undefined) ||
  'https://script.google.com/macros/s/AKfycby-Dsv41BX1B_KyLsvKLS31WvP_kpikatGcevOtHRqQGdQbyjsPia_K2bL9snSgF0poSg/exec';

export type PostSummary = { id: string; title: string; date: string };
export type PostIndex = { title: string; description: string; posts: PostSummary[] };
export type Post = PostSummary & { html: string };

export type BlogResult<T> = { ok: true; data: T } | { ok: false; error: string; notFound?: boolean };

const TIMEOUT_MS = 20000;
const POST_ID = /^[\w-]+$/;

let indexCache: PostIndex | null = null;
const postCache = new Map<string, Post>();

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

export function isValidPostId(id: string): boolean {
  return POST_ID.test(id);
}

export function getCachedIndex(): PostIndex | null {
  return indexCache;
}

export function getCachedPost(id: string): Post | null {
  return postCache.get(id) ?? null;
}

async function request(params: Record<string, string>): Promise<BlogResult<Record<string, unknown>>> {
  const url = new URL(BLOG_ENDPOINT);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal });
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      return { ok: false, error: 'The blog returned an unexpected response.' };
    }
    if (!isRecord(data)) return { ok: false, error: 'The blog returned an unexpected response.' };
    if (typeof data.error === 'string' && data.error.trim() !== '') {
      return { ok: false, error: data.error, notFound: /not found/i.test(data.error) };
    }
    if (!response.ok) return { ok: false, error: 'The blog is unavailable right now.' };
    return { ok: true, data };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, error: 'The blog took too long to respond.' };
    }
    return { ok: false, error: 'Couldn’t reach the blog — check your connection.' };
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchPosts(): Promise<BlogResult<PostIndex>> {
  if (indexCache) return { ok: true, data: indexCache };

  const result = await request({ api: 'posts' });
  if (!result.ok) return result;

  const posts = Array.isArray(result.data.posts)
    ? result.data.posts.map(toSummary).filter((post): post is PostSummary => post !== null)
    : [];
  indexCache = {
    title: str(result.data.title) || 'Writing',
    description: str(result.data.description),
    posts,
  };
  return { ok: true, data: indexCache };
}

export async function fetchPost(id: string): Promise<BlogResult<Post>> {
  if (!isValidPostId(id)) return { ok: false, error: 'That post doesn’t exist.', notFound: true };

  const cached = postCache.get(id);
  if (cached) return { ok: true, data: cached };

  const result = await request({ api: 'post', id });
  if (!result.ok) return result;

  const summary = toSummary(result.data.post);
  if (!summary || !isRecord(result.data.post)) {
    return { ok: false, error: 'That post doesn’t exist.', notFound: true };
  }
  const post: Post = { ...summary, html: str(result.data.post.html) };
  postCache.set(id, post);
  return { ok: true, data: post };
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function readingMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/&[#\w]+;/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export type PostPreview = { excerpt: string; minutes: number; image: string | null };

/**
 * Builds a list-card preview from a post's HTML: the opening paragraph(s)
 * trimmed at a word boundary, reading time, and the first image if any.
 * Parses with an inert DOMParser document, so nothing in the HTML executes.
 */
export function buildPreview(html: string, maxChars = 400): PostPreview {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  let excerpt = '';
  for (const p of Array.from(doc.querySelectorAll('p'))) {
    const text = (p.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (!text) continue;
    excerpt = excerpt ? `${excerpt} ${text}` : text;
    if (excerpt.length >= maxChars * 0.6) break;
  }
  if (excerpt.length > maxChars) {
    const cut = excerpt.slice(0, maxChars);
    excerpt = `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.—–-]+$/, '')}…`;
  }
  const src = doc.querySelector('img')?.getAttribute('src') ?? '';
  return { excerpt, minutes: readingMinutes(html), image: /^https:\/\//i.test(src) ? src : null };
}
