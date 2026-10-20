// Site-wide constants shared by the server functions in api/. Files under
// api/_lib are helpers, not deployed as functions (Vercel skips `_` paths).

export const ORIGIN = 'https://vandanpatel.me';
export const SITE_NAME = 'Vandan Patel';
export const DEFAULT_TITLE = 'Vandan Patel — Software Engineer';
export const DEFAULT_DESCRIPTION =
  "Vandan Patel builds backend and distributed systems. Software Engineering Intern at Fanatics, where he shipped Product Builder's first API and its first AI assistant over non-GitHub data.";
export const BLOG_TITLE = 'Writing — Vandan Patel';

/** "<index title> — Vandan Patel", matching the title the blog page sets client-side. */
export function blogTitle(indexTitle: string): string {
  return indexTitle ? `${indexTitle} — ${SITE_NAME}` : BLOG_TITLE;
}
export const BLOG_DESCRIPTION = 'Notes on backend boundaries, data integrity and building software end to end.';

/** Absolute URL of the generated Open Graph card; bump `v` to bust the CDN cache. */
export function ogImageUrl(params: Record<string, string | number> = {}): string {
  const url = new URL('/api/og', ORIGIN);
  url.searchParams.set('v', '2');
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return url.toString();
}

/**
 * Section pages (each was a part of the one-page home before). Titles and
 * descriptions mirror `pages` in src/lib/routes.ts — keep the two in sync.
 */
export const SECTION_PAGES: Record<string, { title: string; description: string }> = {
  '/work': {
    title: 'Work',
    description:
      'Selected work by Vandan Patel: a fitness analytics PWA, a cent-exact finance ledger, a game platform, and ten more builds.',
  },
  '/experience': {
    title: 'Experience',
    description:
      "Vandan Patel's experience: Software Engineering Intern at Fanatics, plus software, data and project roles at SUNY Oswego.",
  },
  '/about': {
    title: 'About',
    description: 'About Vandan Patel: B.S. Computer Science at SUNY Oswego, his toolkit, recognition and leadership.',
  },
  '/contact': { title: 'Contact', description: 'Get in touch with Vandan Patel.' },
};
