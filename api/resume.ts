// Résumé proxy (Vercel Function). The newest PDF in a Drive folder is served
// by a separate Apps Script web app as base64 chunks; this function rebuilds
// it into a real `application/pdf` response so the browser never talks to
// Google directly and the CDN can cache each version.
//
//   GET /api/resume?meta=1          → { version, updatedAt, size }   (CDN 60s)
//   GET /api/resume?v=VERSION       → that exact PDF                 (immutable)
//   GET /api/resume                 → whatever is newest right now   (CDN 60s)
//   …&download=1                    → Content-Disposition: attachment
//
// A version that's no longer the newest answers 409 { stale, version } so the
// client can reload metadata instead of showing an outdated résumé.

declare const process: { env: Record<string, string | undefined> };

const ENDPOINT =
  process.env.RESUME_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbxdQSDIS5Y45eRmuGpzp5U44QgO8k-38Q3h4MMxfI9AJfzUKYSuZVexgfbEGr7_Bxyx/exec';

const FILENAME = 'Vandan_Patel_Resume.pdf';
const CONCURRENCY = 2;
const CHUNK_RETRIES = 2;
const TIMEOUT_MS = 20000;
const MAX_CHUNKS = 64;

type Meta = { version: string; updatedAt: string; size: number; chunkCount: number };

class UpstreamError extends Error {
  constructor(
    message: string,
    readonly status = 502,
    readonly stale = false,
  ) {
    super(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function callScript(params: Record<string, string>): Promise<Record<string, unknown>> {
  const url = new URL(ENDPOINT);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal, cache: 'no-store' });
    const data: unknown = await response.json().catch(() => null);
    if (!isRecord(data)) throw new UpstreamError('Résumé service returned an unexpected response.');
    if (data.ok !== true) {
      const message = typeof data.error === 'string' ? data.error : 'Résumé service error.';
      throw new UpstreamError(message, data.stale === true ? 409 : 502, data.stale === true);
    }
    return data;
  } catch (err) {
    if (err instanceof UpstreamError) throw err;
    throw new UpstreamError(
      err instanceof Error && err.name === 'AbortError' ? 'Résumé service timed out.' : 'Résumé service unreachable.',
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function latest(): Promise<Meta> {
  const data = await callScript({ action: 'latest' });
  const { version, updatedAt, size, chunkCount } = data;
  if (
    typeof version !== 'string' ||
    typeof size !== 'number' ||
    typeof chunkCount !== 'number' ||
    !Number.isInteger(chunkCount) ||
    chunkCount < 1 ||
    chunkCount > MAX_CHUNKS
  ) {
    throw new UpstreamError('Résumé metadata is malformed.');
  }
  return { version, updatedAt: typeof updatedAt === 'string' ? updatedAt : '', size, chunkCount };
}

async function chunk(meta: Meta, index: number): Promise<string> {
  for (let attempt = 0; ; attempt++) {
    try {
      const data = await callScript({ action: 'chunk', version: meta.version, index: String(index) });
      if (data.version !== meta.version) throw new UpstreamError('Résumé changed while loading.', 409, true);
      if (data.index !== index || typeof data.data !== 'string') {
        throw new UpstreamError('Résumé chunk is malformed.');
      }
      return data.data;
    } catch (err) {
      // A version change is final for this attempt; anything else gets a retry.
      if ((err instanceof UpstreamError && err.stale) || attempt >= CHUNK_RETRIES) throw err;
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
}

/** Fetches every chunk (a few at a time) and rebuilds and verifies the PDF bytes. */
async function assemble(meta: Meta): Promise<Uint8Array> {
  const parts = new Array<string>(meta.chunkCount);
  let next = 0;
  const worker = async () => {
    while (next < meta.chunkCount) {
      const index = next++;
      parts[index] = await chunk(meta, index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, meta.chunkCount) }, worker));

  let binary: string;
  try {
    binary = atob(parts.join(''));
  } catch {
    throw new UpstreamError('Résumé data is corrupt.');
  }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const header = String.fromCharCode(...bytes.subarray(0, 5));
  if (bytes.length !== meta.size || header !== '%PDF-') throw new UpstreamError('Résumé data is corrupt.');
  return bytes;
}

/** Resolves a PDF for `requested` (or the newest), restarting once if the version flips mid-load. */
async function loadPdf(requested: string | null): Promise<{ meta: Meta; bytes: Uint8Array }> {
  for (let attempt = 0; ; attempt++) {
    const meta = await latest();
    if (requested && requested !== meta.version) {
      throw Object.assign(new UpstreamError('A newer résumé is available.', 409, true), { version: meta.version });
    }
    try {
      return { meta, bytes: await assemble(meta) };
    } catch (err) {
      if (!(err instanceof UpstreamError && err.stale) || attempt >= 1) throw err;
    }
  }
}

const SHORT_CACHE = {
  'Cache-Control': 'public, max-age=0, must-revalidate',
  'CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
};

function json(body: unknown, status: number, headers: Record<string, string> = { 'Cache-Control': 'no-store' }) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;

  try {
    if (params.has('meta')) {
      const { version, updatedAt, size } = await latest();
      return json({ version, updatedAt, size }, 200, SHORT_CACHE);
    }

    const requested = params.get('v');
    const { bytes } = await loadPdf(requested);
    const disposition = params.get('download') === '1' ? 'attachment' : 'inline';

    return new Response(bytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(bytes.length),
        'Content-Disposition': `${disposition}; filename="${FILENAME}"`,
        'X-Content-Type-Options': 'nosniff',
        // Versioned URLs never change content, so they cache forever; the
        // bare URL always means "newest" and must stay short-lived.
        ...(requested ? { 'Cache-Control': 'public, max-age=31536000, immutable' } : SHORT_CACHE),
      },
    });
  } catch (err) {
    if (err instanceof UpstreamError) {
      const version = (err as UpstreamError & { version?: string }).version;
      return json({ error: err.message, stale: err.stale || undefined, version }, err.status);
    }
    return json({ error: 'Unexpected error loading the résumé.' }, 500);
  }
}
