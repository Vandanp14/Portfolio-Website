// Liveness probe for uptime monitoring (.github/workflows/uptime.yml).
//
//   GET /api/health → { ok: true, time }   (never cached)

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify({ ok: true, time: new Date().toISOString() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
