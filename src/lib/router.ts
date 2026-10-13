import { useEffect, useState } from 'react';
import type { SectionId } from '../content/portfolio';
import { scrollToSection } from '../hooks/useScrollSpy';

// A deliberately tiny History-API router: the site has exactly two page
// kinds (the one-page portfolio and the blog), so react-router would be
// more weight than routing logic.

const EVENT = 'app:navigate';

export function usePath(): string {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener('popstate', sync);
    window.addEventListener(EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(EVENT, sync);
    };
  }, []);

  return path;
}

export function navigate(to: string) {
  if (to === window.location.pathname + window.location.hash) return;
  window.history.pushState(null, '', to);
  window.dispatchEvent(new Event(EVENT));
  if (!to.includes('#')) window.scrollTo({ top: 0, behavior: 'auto' });
}

export function isHome(path = window.location.pathname): boolean {
  return path === '/' || path === '';
}

/** Section links work from any page: scroll in place on home, otherwise route to `/#id`. */
export function goToSection(id: SectionId) {
  if (isHome()) {
    scrollToSection(id);
  } else {
    navigate(id === 'top' ? '/' : `/#${id}`);
  }
}
