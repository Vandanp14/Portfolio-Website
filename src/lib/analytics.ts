// Thin wrapper over the GA4 `gtag` set up in index.html. It's a no-op off the
// production domain (gtag is never defined there) or when blocked by an
// ad blocker, so callers never need to guard.

type Gtag = (command: 'event', name: string, params?: Record<string, unknown>) => void;

export function track(name: string, params?: Record<string, unknown>) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params);
}
