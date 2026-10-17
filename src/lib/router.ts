import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import type { SectionId } from '../content/portfolio';
import { depth, pages } from './routes';

// A deliberately tiny History-API router. Every route change runs inside a
// View Transition so the site reads as one surface sliding sideways: moving
// to a later page slides forward (in from the right), moving to an earlier
// one — or pressing Back — slides back. The direction is published on
// <html data-nav-dir> for the CSS in index.css. Browsers without View
// Transitions (or with reduced motion) swap instantly.

const EVENT = 'app:navigate';

type Direction = 'forward' | 'back';
type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

export function usePath(): string {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  return path;
}

export const supportsViewTransitions = () =>
  typeof (document as ViewTransitionDoc).startViewTransition === 'function';

function transition(direction: Direction, update: () => void) {
  const doc = document as ViewTransitionDoc;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !doc.startViewTransition) {
    update();
    return;
  }
  const root = document.documentElement;
  root.dataset.navDir = direction;
  // flushSync: React must commit the new page before the "after" snapshot.
  const run = doc.startViewTransition(() => flushSync(update));
  run.finished.finally(() => {
    delete root.dataset.navDir;
  });
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

// Each history entry carries its position, so popstate knows whether the
// user went back or forward.
let position: number = (window.history.state as { i?: number } | null)?.i ?? 0;
if ((window.history.state as { i?: number } | null)?.i === undefined) {
  window.history.replaceState({ ...(window.history.state ?? {}), i: position }, '');
}

window.addEventListener('popstate', (event) => {
  const next = (event.state as { i?: number } | null)?.i ?? 0;
  const direction: Direction = next < position ? 'back' : 'forward';
  position = next;
  transition(direction, () => window.dispatchEvent(new Event(EVENT)));
});

export function navigate(to: string, { replace = false }: { replace?: boolean } = {}) {
  if (to === window.location.pathname + window.location.hash) return;
  const target = new URL(to, window.location.origin);
  const samePage = target.pathname === window.location.pathname;

  const update = () => {
    if (replace) {
      window.history.replaceState({ i: position }, '', to);
    } else {
      position += 1;
      window.history.pushState({ i: position }, '', to);
    }
    window.dispatchEvent(new Event(EVENT));
    if (!target.hash) window.scrollTo({ top: 0, behavior: 'auto' });
  };

  if (samePage || replace) {
    update();
    return;
  }
  const direction: Direction = depth(target.pathname) >= depth(window.location.pathname) ? 'forward' : 'back';
  transition(direction, update);
}

export function isHome(path = window.location.pathname): boolean {
  return path === '/' || path === '';
}

/** Every section is its own page now: `top` is home, the rest live at `/<id>`. */
export function goToSection(id: SectionId) {
  navigate(id === 'top' ? '/' : `/${id}`);
}
