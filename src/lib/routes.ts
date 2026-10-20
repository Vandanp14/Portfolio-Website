import { RESUME_URL } from '../content/portfolio';

// Every top-level page, in the order the homepage index lists them. The order
// also drives transition direction: moving to a later page slides forward
// (in from the right), moving to an earlier one slides back.

export type PageId = 'work' | 'experience' | 'about' | 'blog' | 'resume' | 'contact';

export type PageDef = {
  id: PageId;
  path: string;
  label: string;
  /** One line under the page name on the homepage index. */
  teaser: string;
  /** Meta description for the page. */
  description: string;
};

export const pages: PageDef[] = [
  {
    id: 'work',
    path: '/work',
    label: 'Work',
    teaser: 'Three products end to end, and ten more builds',
    description:
      'Selected work by Vandan Patel: a fitness analytics PWA, a cent-exact finance ledger, a game platform, and ten more builds.',
  },
  {
    id: 'experience',
    path: '/experience',
    label: 'Experience',
    teaser: 'Fanatics, and three years at SUNY Oswego',
    description:
      "Vandan Patel's experience: Software Engineering Intern at Fanatics, plus software, data and project roles at SUNY Oswego.",
  },
  {
    id: 'about',
    path: '/about',
    label: 'About',
    teaser: 'Education, toolkit and recognition',
    description: 'About Vandan Patel: B.S. Computer Science at SUNY Oswego, his toolkit, recognition and leadership.',
  },
  {
    id: 'blog',
    path: '/blog',
    label: 'Writing',
    teaser: 'Notes on systems, tools and things I ship',
    description:
      'Short essays on backend boundaries, data integrity and the parts of shipping nobody puts in a demo.',
  },
  {
    id: 'resume',
    path: RESUME_URL,
    label: 'Résumé',
    teaser: 'Always the latest PDF',
    description: "Vandan Patel's résumé.",
  },
  {
    id: 'contact',
    path: '/contact',
    label: 'Contact',
    teaser: 'Say hello, or tell me what you are building',
    description: 'Contact Vandan Patel for backend, platform or applied AI roles — available for Summer 2027.',
  },
];

export function pageById(id: PageId): PageDef {
  return pages.find((page) => page.id === id)!;
}

/** Which top-level page a path belongs to (`/blog/abc` → blog); null for home and unknown paths. */
export function pageForPath(path: string): PageDef | null {
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path;
  return pages.find((page) => clean === page.path || clean.startsWith(`${page.path}/`)) ?? null;
}

/** Position along the site's left-to-right axis. Home is 0; a blog post sits just past the blog index. */
export function depth(path: string): number {
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path;
  if (clean === '/' || clean === '') return 0;
  const index = pages.findIndex((page) => clean === page.path || clean.startsWith(`${page.path}/`));
  if (index === -1) return pages.length + 1;
  return index + 1 + (clean === pages[index].path ? 0 : 0.5);
}

/** The page after this one, wrapping to the first. */
export function nextPage(id: PageId): PageDef {
  const index = pages.findIndex((page) => page.id === id);
  return pages[(index + 1) % pages.length];
}
