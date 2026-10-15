// Blog proxy (Vercel Function). The browser reads posts through here instead
// of calling the Apps Script web app directly, so the CDN absorbs repeat
// traffic and a slow Apps Script cold start is paid once per cache window.
//
//   GET /api/blog?api=posts         → { title, description, posts:[{id,title,date}] }
//   GET /api/blog?api=post&id=ID    → { post:{ id, title, date, html } }
//
// Successes cache 5 min at the CDN and may be served stale for a day while
// revalidating; errors are never cached.

import { fetchIndex, fetchPost, POST_ID } from './_lib/blog.js';

const CACHED = { 'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400' };

function json(body: unknown, status: number, headers: Record<string, string> = { 'Cache-Control': 'no-store' }) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const api = params.get('api');

  if (api === 'posts') {
    const result = await fetchIndex();
    return result.ok ? json(result.data, 200, CACHED) : json({ error: result.error }, 502);
  }

  if (api === 'post') {
    const id = params.get('id') ?? '';
    if (!POST_ID.test(id)) return json({ error: 'Post not found.' }, 404);
    const result = await fetchPost(id);
    if (result.ok) return json({ post: result.data }, 200, CACHED);
    return json({ error: result.notFound ? 'Post not found.' : result.error }, result.notFound ? 404 : 502);
  }

  return json({ error: 'Unknown request. Use ?api=posts or ?api=post&id=ID.' }, 400);
}
