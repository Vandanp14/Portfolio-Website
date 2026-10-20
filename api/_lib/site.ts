// Site-wide constants shared by the server functions in api/. Files under
// api/_lib are helpers, not deployed as functions (Vercel skips `_` paths).

export const ORIGIN = 'https://vandanpatel.me';
export const SITE_NAME = 'Vandan Patel';
export const DEFAULT_TITLE = 'Vandan Patel — Software Engineer';
export const DEFAULT_DESCRIPTION =
  "Vandan Patel builds backend and distributed systems. Software Engineering Intern at Fanatics, where he shipped Product Builder's first API and its first AI assistant over non-GitHub data.";
export const BLOG_TITLE = 'Writing — Vandan Patel';
export const BLOG_DESCRIPTION =
  'Short essays on backend boundaries, data integrity and the parts of shipping nobody puts in a demo.';

/** Absolute URL of the generated Open Graph card; bump `v` to bust the CDN cache. */
export function ogImageUrl(params: Record<string, string | number> = {}): string {
  const url = new URL('/api/og', ORIGIN);
  url.searchParams.set('v', '3');
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  // URLSearchParams encodes spaces as `+`; `%20` survives every proxy and
  // function runtime unchanged, so titles never render with literal plus signs.
  return url.toString().replace(/\+/g, '%20');
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
  '/contact': {
    title: 'Contact',
    description:
      'Contact Vandan Patel for backend, platform or applied AI roles — available for Summer 2027.',
  },
};
