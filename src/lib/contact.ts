// Transport layer for the contact form. Talks to a Google Apps Script web
// app that's deployed separately and configured via VITE_CONTACT_ENDPOINT.

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot — must stay empty for a real human. */
  company: string;
  /** Client timestamp, used to reject sub-2s submissions. */
  startedAt: number;
};

export type ContactResult = { ok: true } | { ok: false; error: string };

// Read defensively rather than declaring an ImportMetaEnv interface — the
// value is genuinely optional until the Apps Script deployment exists.
export const CONTACT_ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) ?? '';

const DIRECT_EMAIL = 'patelvandan024@gmail.com';
const TIMEOUT_MS = 15000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSuccess(data: unknown): boolean {
  return isRecord(data) && data.ok === true;
}

function extractServerError(data: unknown): string | null {
  if (isRecord(data) && typeof data.error === 'string' && data.error.trim() !== '') {
    return data.error;
  }
  return null;
}

export async function sendContact(payload: ContactPayload): Promise<ContactResult> {
  if (CONTACT_ENDPOINT === '') {
    return {
      ok: false,
      error: `Contact form is not configured yet. Email me directly at ${DIRECT_EMAIL}.`,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      // text/plain (not application/json) keeps this a CORS "simple
      // request" so the browser skips the preflight — Apps Script can't
      // answer an OPTIONS preflight, so application/json would just fail.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow', // Apps Script 302s to googleusercontent.com.
      signal: controller.signal,
    });

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      return {
        ok: false,
        error: `Got an unexpected response from the server. Email me directly at ${DIRECT_EMAIL}.`,
      };
    }

    if (isSuccess(data)) {
      return { ok: true };
    }

    const serverMessage = extractServerError(data);
    if (serverMessage) {
      return { ok: false, error: serverMessage };
    }

    if (!response.ok) {
      return {
        ok: false,
        error: `The message couldn't be sent (the server returned an error). Email me directly at ${DIRECT_EMAIL}.`,
      };
    }

    return {
      ok: false,
      error: `Got an unexpected response from the server. Email me directly at ${DIRECT_EMAIL}.`,
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        ok: false,
        error: `The request timed out. Email me directly at ${DIRECT_EMAIL}.`,
      };
    }
    return {
      ok: false,
      error: `Something went wrong sending your message — check your connection, or email me directly at ${DIRECT_EMAIL}.`,
    };
  } finally {
    clearTimeout(timeout);
  }
}
