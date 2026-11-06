import { RESUME_URL } from '../content/portfolio';

// Every top-level page, in the order the home page lists them.

export type PageId = 'work' | 'experience' | 'about' | 'blog' | 'resume' | 'contact';

export type PageDef = {
  id: PageId;
  path: string;
  label: string;
  /** Meta description for the page. */
  description: string;
};

export const pages: PageDef[] = [
  {
    id: 'work',
    path: '/work',
    label: 'Work',
    description:
      'Projects by Vandan Patel, including a fitness app, a dining hall menu, a bus tracker and a shared-expense app.',
  },
  {
    id: 'experience',
    path: '/experience',
    label: 'Experience',
    description: "Vandan Patel's experience at Fanatics and SUNY Oswego.",
  },
  {
    id: 'about',
    path: '/about',
    label: 'About',
    description: "Vandan Patel's education, tools and recognition.",
  },
  {
    id: 'blog',
    path: '/blog',
    label: 'Writing',
    description: 'Notes on what I build.',
  },
  {
    id: 'resume',
    path: RESUME_URL,
    label: 'Résumé',
    description: "Vandan Patel's résumé.",
  },
  {
    id: 'contact',
    path: '/contact',
    label: 'Contact',
    description: 'How to reach Vandan Patel.',
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
