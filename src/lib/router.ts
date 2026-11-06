import { useEffect, useState } from 'react';
import type { SectionId } from '../content/portfolio';
import { pages } from './routes';

// A deliberately tiny History-API router. Page changes swap content and
// scroll to the top; index.css fades the new page in.

const EVENT = 'app:navigate';

export function usePath(): string {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  return path;
}

// Links from the one-page era (`/#work`) now live at `/work`. Rewritten
// before the first render, so the app boots straight onto the right page.
{
  const legacy = window.location.hash.slice(1);
  if ((window.location.pathname === '/' || window.location.pathname === '') && legacy) {
    const page = pages.find((p) => p.path === `/${legacy}`);
    if (page) window.history.replaceState(window.history.state, '', page.path);
  }
}

window.addEventListener('popstate', () => window.dispatchEvent(new Event(EVENT)));

export function navigate(to: string, { replace = false }: { replace?: boolean } = {}) {
  if (to === window.location.pathname + window.location.hash) return;
  const target = new URL(to, window.location.origin);

  if (replace) window.history.replaceState(window.history.state, '', to);
  else window.history.pushState(window.history.state, '', to);
  window.dispatchEvent(new Event(EVENT));
  if (!target.hash) window.scrollTo({ top: 0, behavior: 'auto' });
}

export function isHome(path = window.location.pathname): boolean {
  return path === '/' || path === '';
}

/** Every section is its own page now: `top` is home, the rest live at `/<id>`. */
export function goToSection(id: SectionId) {
  navigate(id === 'top' ? '/' : `/${id}`);
}
