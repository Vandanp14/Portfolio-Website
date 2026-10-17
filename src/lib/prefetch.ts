// Code-split pages, shared by App's lazy() and link prefetching. A chunk that
// is already loading or loaded is never requested twice (import() caches).

export const loadBlog = () => import('../pages/Blog');
// pdf.js is large — only fetched once someone heads for the résumé.
export const loadResume = () => import('../pages/Resume');

export function prefetchRoute(path: string) {
  if (path.startsWith('/blog')) void loadBlog();
  else if (path.startsWith('/resume')) void loadResume();
}
