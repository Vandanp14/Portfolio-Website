// Transport layer for the blog. Posts are written in Google Docs and served as
// JSON by a separate, public, read-only Apps Script web app. The browser reads
// it through our own `/api/blog` proxy (api/blog.ts), which the Vercel CDN
// caches — so most visits never wait on Apps Script at all.

import { formatCalendarDate } from './dates';

export const BLOG_ENDPOINT = (import.meta.env.VITE_BLOG_ENDPOINT as string | undefined) || '/api/blog';

export type PostSummary = { id: string; title: string; date: string };
export type PostIndex = { title: string; description: string; posts: PostSummary[] };
export type Post = PostSummary & { html: string };

export type BlogResult<T> = { ok: true; data: T } | { ok: false; error: string; notFound?: boolean };

const TIMEOUT_MS = 20000;
const POST_ID = /^[\w-]+$/;

// Two cache layers: memory for this page, sessionStorage so a reload or a
// return within the TTL paints instantly. Storage can throw (private mode,
// blocked cookies) — every access is guarded and failure just means a fetch.
const STORE_PREFIX = 'blog:';
const STORE_TTL_MS = 10 * 60 * 1000;

function readStore<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(STORE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { at: number; data: T };
    if (Date.now() - entry.at > STORE_TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeStore(key: string, data: unknown) {
  try {
    sessionStorage.setItem(STORE_PREFIX + key, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // Quota or blocked storage: memory cache still works.
  }
}

let indexCache: PostIndex | null = readStore<PostIndex>('index');
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
  const hit = postCache.get(id);
  if (hit) return hit;
  const stored = readStore<Post>(`post:${id}`);
  if (stored) postCache.set(id, stored);
  return stored;
}

async function request(params: Record<string, string>): Promise<BlogResult<Record<string, unknown>>> {
  const url = new URL(BLOG_ENDPOINT, window.location.origin);
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
  writeStore('index', indexCache);
  return { ok: true, data: indexCache };
}

export async function fetchPost(id: string): Promise<BlogResult<Post>> {
  if (!isValidPostId(id)) return { ok: false, error: 'That post doesn’t exist.', notFound: true };

  const cached = getCachedPost(id);
  if (cached) return { ok: true, data: cached };

  const result = await request({ api: 'post', id });
  if (!result.ok) return result;

  const summary = toSummary(result.data.post);
  if (!summary || !isRecord(result.data.post)) {
    return { ok: false, error: 'That post doesn’t exist.', notFound: true };
  }
  const post: Post = { ...summary, html: str(result.data.post.html) };
  postCache.set(id, post);
  writeStore(`post:${id}`, post);
  return { ok: true, data: post };
}

export function formatDate(value: string): string {
  return formatCalendarDate(value);
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
