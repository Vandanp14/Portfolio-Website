// Client for the résumé proxy (`api/resume.ts`). The proxy turns the Apps
// Script's base64 chunks into a real PDF; this side only checks which version
// is newest and downloads that version's bytes, reporting progress.

export const RESUME_API = '/api/resume';
export const RESUME_FILENAME = 'Vandan_Patel_Resume.pdf';

export type ResumeMeta = { version: string; updatedAt: string; size: number };
export type ResumeFile = { meta: ResumeMeta; bytes: Uint8Array };
export type ResumeResult = { ok: true; data: ResumeFile } | { ok: false; error: string };

const META_TIMEOUT_MS = 20000;
const PDF_TIMEOUT_MS = 60000;
const MAX_STALE_RETRIES = 2;

// Last résumé shown this session — reused only while the server still
// reports the same version.
let cached: ResumeFile | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function errorFrom(data: unknown, fallback: string): string {
  return isRecord(data) && typeof data.error === 'string' && data.error.trim() !== '' ? data.error : fallback;
}

export function pdfUrl(version: string, download = false): string {
  const params = new URLSearchParams({ v: version });
  if (download) params.set('download', '1');
  return `${RESUME_API}?${params}`;
}

async function fetchMeta(): Promise<ResumeMeta> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), META_TIMEOUT_MS);
  try {
    const response = await fetch(`${RESUME_API}?meta=1`, { signal: controller.signal, cache: 'no-cache' });
    const data: unknown = await response.json().catch(() => null);
    if (!response.ok || !isRecord(data) || typeof data.version !== 'string') {
      throw new Error(errorFrom(data, 'Couldn’t check for the latest résumé.'));
    }
    return {
      version: data.version,
      updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : '',
      size: typeof data.size === 'number' ? data.size : 0,
    };
  } finally {
    clearTimeout(timeout);
  }
}

class StaleVersion extends Error {}

async function fetchBytes(meta: ResumeMeta, onProgress: (fraction: number) => void): Promise<Uint8Array> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PDF_TIMEOUT_MS);
  try {
    const response = await fetch(pdfUrl(meta.version), { signal: controller.signal });
    if (response.status === 409) throw new StaleVersion();
    if (!response.ok || !response.body) {
      const data: unknown = await response.json().catch(() => null);
      throw new Error(errorFrom(data, 'Couldn’t download the résumé.'));
    }

    const total = Number(response.headers.get('Content-Length')) || meta.size;
    const reader = response.body.getReader();
    const parts: Uint8Array[] = [];
    let received = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      parts.push(value);
      received += value.length;
      if (total) onProgress(Math.min(1, received / total));
    }

    const bytes = new Uint8Array(received);
    let offset = 0;
    for (const part of parts) {
      bytes.set(part, offset);
      offset += part.length;
    }
    return bytes;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Always re-checks the newest version first, so a newly uploaded résumé
 * replaces a cached one; bytes are only downloaded when the version changed.
 */
export async function loadResume(
  onPhase: (phase: 'checking' | 'downloading', progress?: number) => void,
): Promise<ResumeResult> {
  try {
    for (let attempt = 0; ; attempt++) {
      onPhase('checking');
      const meta = await fetchMeta();
      if (cached && cached.meta.version === meta.version) return { ok: true, data: cached };

      onPhase('downloading', 0);
      try {
        const bytes = await fetchBytes(meta, (fraction) => onPhase('downloading', fraction));
        cached = { meta, bytes };
        return { ok: true, data: cached };
      } catch (err) {
        // The résumé was replaced mid-load — start over with fresh metadata.
        if (err instanceof StaleVersion && attempt < MAX_STALE_RETRIES) continue;
        throw err;
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, error: 'The résumé took too long to load.' };
    }
    if (err instanceof StaleVersion) {
      return { ok: false, error: 'The résumé is being updated right now — try again in a moment.' };
    }
    if (err instanceof TypeError) {
      return { ok: false, error: 'Couldn’t reach the server — check your connection.' };
    }
    return { ok: false, error: err instanceof Error ? err.message : 'Couldn’t load the résumé.' };
  }
}

export function formatUpdated(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
