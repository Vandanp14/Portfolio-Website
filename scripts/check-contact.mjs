// Non-delivery smoke test: never sends a valid message or consumes the rate limit.
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), 'VITE_CONTACT_');
const siteUrl = process.env.CONTACT_SITE_URL || 'https://vandanpatel.me';
const endpointOverride = process.argv[2] || process.env.VITE_CONTACT_ENDPOINT || env.VITE_CONTACT_ENDPOINT;
const timeoutMs = 15000; // Match the form's deadline.

async function findLiveEndpoint() {
  const site = new URL(siteUrl);
  const response = await fetch(site, { signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) throw new Error(`Site: HTTP ${response.status}`);
  const html = await response.text();
  const bundles = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+\.js)["']/gi)];
  for (const [, src] of bundles) {
    const bundleResponse = await fetch(new URL(src, site), { signal: AbortSignal.timeout(timeoutMs) });
    if (!bundleResponse.ok) continue;
    const bundle = await bundleResponse.text();
    const match = bundle.match(/https:\/\/script\.google\.com\/macros\/s\/[^"'\s]+?\/exec/);
    if (match) return match[0];
  }
  throw new Error(`Could not find a contact endpoint in the JavaScript served by ${site.origin}`);
}

async function probe(endpoint, method) {
  const started = Date.now();
  const signal = AbortSignal.timeout(timeoutMs);
  let response = await fetch(endpoint, {
    method,
    redirect: 'manual',
    signal,
    ...(method === 'POST'
      ? { headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: '{}' }
      : {}),
  });
  // Google serves ContentService output through a temporary GET URL. Use a
  // fresh GET with no POST headers/body; Node's automatic redirect failed
  // this probe even when the equivalent browser request succeeded.
  if (response.status === 302 || response.status === 303) {
    const location = response.headers.get('location');
    if (!location) throw new Error(`${method}: redirect has no Location header`);
    const target = new URL(location);
    if (target.protocol !== 'https:' || target.hostname !== 'script.googleusercontent.com') {
      throw new Error(`${method}: unexpected redirect host (check deployment access/authorization)`);
    }
    await response.body?.cancel();
    response = await fetch(target, { method: 'GET', redirect: 'error', signal });
  }
  if (!response.ok) {
    throw new Error(`${method}: HTTP ${response.status} from ${new URL(response.url).hostname}`);
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`${method}: expected JSON; received an HTML/login/error response`);
  }
  const passed = method === 'GET'
    ? data?.ok === true && data?.service === 'contact' && data?.mailReady === true
    : data?.ok === false && data?.error === 'Please include your name.';
  if (!passed) {
    throw new Error(`${method}: unexpected response or mail readiness failed; see apps-script/README.md`);
  }
  console.log(`${method} passed (${Date.now() - started}ms)`);
}

try {
  const endpoint = endpointOverride || await findLiveEndpoint();
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || url.hostname !== 'script.google.com' || !/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname)) {
    throw new Error('Expected a Google Apps Script HTTPS /macros/s/<deployment-id>/exec URL.');
  }
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      await probe(endpoint, 'GET');
      await probe(endpoint, 'POST');
      console.log('Contact readiness and POST validation passed. No email was sent. Inbox delivery and browser CORS are separate checks.');
      process.exit(0);
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt}/2 failed: ${error.message}`);
      if (attempt === 1) await new Promise((resolve) => setTimeout(resolve, 15000));
    }
  }
  throw lastError;
} catch (error) {
  console.error(`Contact check FAILED: ${error.message}`);
  console.error('Recovery: apps-script/README.md');
  process.exitCode = 1;
}
