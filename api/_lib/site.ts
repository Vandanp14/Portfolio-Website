// Site-wide constants shared by the server functions in api/. Files under
// api/_lib are helpers, not deployed as functions (Vercel skips `_` paths).

export const ORIGIN = 'https://vandanpatel.me';
export const SITE_NAME = 'Vandan Patel';
export const DEFAULT_TITLE = 'Vandan Patel | Software Engineer';
export const DEFAULT_DESCRIPTION =
  'Vandan Patel is a software engineer finishing a computer science degree at SUNY Oswego.';
export const BLOG_TITLE = 'Writing | Vandan Patel';

/** "<index title> | Vandan Patel", matching the title the blog page sets client-side. */
export function blogTitle(indexTitle: string): string {
  return indexTitle ? `${indexTitle} | ${SITE_NAME}` : BLOG_TITLE;
}
export const BLOG_DESCRIPTION = 'Notes on what I build.';

/** Absolute URL of the generated Open Graph card; bump `v` to bust the CDN cache. */
export function ogImageUrl(params: Record<string, string | number> = {}): string {
  const url = new URL('/api/og', ORIGIN);
  url.searchParams.set('v', '2');
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return url.toString();
}

/**
 * Section pages (each was a part of the one-page home before). Titles and
 * descriptions mirror `pages` in src/lib/routes.ts. Keep the two in sync.
 */
export const SECTION_PAGES: Record<string, { title: string; description: string }> = {
  '/work': {
    title: 'Work',
    description:
      'Projects by Vandan Patel, including a fitness app, a dining hall menu, a bus tracker and a shared-expense app.',
  },
  '/experience': {
    title: 'Experience',
    description:
      "Vandan Patel's experience at Fanatics and SUNY Oswego.",
  },
  '/about': {
    title: 'About',
    description: "Vandan Patel's education, tools and recognition.",
  },
  '/contact': { title: 'Contact', description: 'How to reach Vandan Patel.' },
};

/**
 * Project pages (/work/:id). Titles and descriptions mirror `featuredProjects`
 * in src/content/portfolio.ts (description = tagline). Keep the two in sync.
 */
export const PROJECT_PAGES: Record<string, { title: string; description: string }> = {
  'mfp-coach': {
    title: "MFP Coach",
    description:
      "A fitness app that pulls Apple Watch, nutrition and workout data into one place and gives me a plan for the day.",
  },
  'oswego-dining': {
    title: "Oswego Dining",
    description:
      "Today’s SUNY Oswego dining hall menus, ranked by protein per calorie.",
  },
  'evenly': {
    title: "Evenly",
    description:
      "A shared-expense app I built for a Thanksgiving trip to Utah with friends.",
  },
  'transit-ledger': {
    title: "Transit Ledger",
    description:
      "A personal finance app for tracking rent, commute and spending during a summer in New York.",
  },
  'ats-resume-tailor': {
    title: "ATS Résumé Tailor",
    description:
      "Tailors my résumé to a job description without letting the model make anything up.",
  },
  'mint-game-hub': {
    title: "MINT Game Hub",
    description:
      "Five daily browser games about trading cards, built for an intern team and adopted for its hobby immersion program.",
  },
  'centro': {
    title: "Centro Oswego Live",
    description:
      "Live bus arrivals and a map for Centro’s Oswego routes.",
  },
  'higheredjobs-review': {
    title: "HigherEdJobs Review",
    description:
      "Finds higher-ed IT jobs and flags what each posting says about visa sponsorship.",
  },
};
