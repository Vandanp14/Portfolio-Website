import { useEffect } from 'react';

// Client-side half of per-page metadata. Crawlers and link-preview bots get
// route-specific tags from the server (api/page.ts injects them into
// index.html for /blog, /blog/:id and /resume); this hook keeps the same tags
// correct after in-app navigation and for Google's JS renderer.

export const SITE_ORIGIN = 'https://vandanpatel.me';
const SITE_NAME = 'Vandan Patel';

export type PageMeta = {
  /** Page title without the site suffix; null = keep whatever is there. */
  title: string | null;
  description?: string;
  /** Canonical path, e.g. `/blog/my-post`. */
  path?: string;
  noindex?: boolean;
  /** Use `title` as-is instead of appending the site name (home page). */
  exactTitle?: boolean;
};

type MetaKey = ['name' | 'property', string];

function metaEl(attr: MetaKey[0], key: string): HTMLMetaElement | null {
  return document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
}

export function usePageMeta(meta: PageMeta | null) {
  const { title, description, path, noindex = false, exactTitle = false } = meta ?? {};
  useEffect(() => {
    if (!meta || !title) return;
    const fullTitle = exactTitle ? title : `${title} — ${SITE_NAME}`;
    const url = path ? SITE_ORIGIN + path : null;

    const values: [MetaKey, string | null][] = [
      [['property', 'og:title'], fullTitle],
      [['name', 'twitter:title'], fullTitle],
      [['name', 'description'], description ?? null],
      [['property', 'og:description'], description ?? null],
      [['name', 'twitter:description'], description ?? null],
      [['property', 'og:url'], url],
      [['name', 'robots'], noindex ? 'noindex' : null],
    ];

    // Remember what was there so leaving the page restores it exactly.
    const previousTitle = document.title;
    const canonical = document.head.querySelector('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute('href') ?? null;
    const restore: (() => void)[] = [];

    document.title = fullTitle;
    if (url && canonical) canonical.setAttribute('href', url);
    for (const [[attr, key], content] of values) {
      if (content === null) continue;
      const existing = metaEl(attr, key);
      if (existing) {
        const before = existing.getAttribute('content') ?? '';
        existing.setAttribute('content', content);
        restore.push(() => existing.setAttribute('content', before));
      } else {
        const el = document.createElement('meta');
        el.setAttribute(attr, key);
        el.setAttribute('content', content);
        document.head.appendChild(el);
        restore.push(() => el.remove());
      }
    }

    return () => {
      document.title = previousTitle;
      if (canonical && previousCanonical !== null) canonical.setAttribute('href', previousCanonical);
      restore.forEach((undo) => undo());
    };
  }, [meta, title, description, path, noindex, exactTitle]);
}

/** Injects a JSON-LD block for the lifetime of the calling component. */
export function useJsonLd(id: string, data: unknown | null) {
  const json = JSON.stringify(data);
  useEffect(() => {
    if (data === null) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = json;
    document.head.appendChild(script);
    return () => script.remove();
  }, [id, json, data]);
}
