import { useEffect, useState } from 'react';
import { experience, featuredProjects, otherProjects, profile } from '../content/portfolio';
import { fetchPosts, getCachedIndex } from '../lib/blog';
import { pages, type PageDef, type PageId } from '../lib/routes';
import { Link } from './Link';
import { Eyebrow, Shell } from './primitives';

/**
 * A compact editorial directory: every route has a short description and
 * enough click area to remain comfortable on touch screens.
 */
export function PageIndex() {
  const posts = usePostCount();

  const meta: Record<PageId, string> = {
    work: `${featuredProjects.length + otherProjects.length} projects`,
    experience: `${experience.length} roles`,
    about: 'Education · Toolkit',
    blog: posts === null ? '' : `${posts} ${posts === 1 ? 'post' : 'posts'}`,
    resume: 'PDF',
    contact: profile.email,
  };

  return (
    <section id="index" aria-labelledby="index-title" className="band band-paper scroll-mt-[var(--nav-h)] pb-[var(--section)]">
      <Shell>
        <div className="flex items-baseline justify-between gap-6 pb-5">
          <Eyebrow>
            <span id="index-title">Index</span>
          </Eyebrow>
          <span className="t-index text-[var(--text-3)]">{pages.length.toString().padStart(2, '0')} pages</span>
        </div>
        <nav aria-labelledby="index-title">
          <ul className="page-index-grid">
            {pages.map((page, i) => (
              <li key={page.id}>
                <IndexRow page={page} index={i} meta={meta[page.id]} />
              </li>
            ))}
          </ul>
        </nav>
      </Shell>
    </section>
  );
}

export function IndexRow({ page, index, meta }: { page: PageDef; index: number; meta: string }) {
  return (
    <Link to={page.path} aria-label={`${page.label} — ${page.teaser}`} className="page-index-card reveal">
      <span className="page-index-meta"><span>/0.{index + 1}</span><span>{meta}</span></span>
      <span className="page-index-main">
        <span className="page-index-title">{page.label}</span>
        <span className="page-index-teaser">{page.teaser}</span>
      </span>
      <span aria-hidden="true" className="page-index-arrow">↗</span>
      </Link>
  );
}

/** Number of blog posts, from the cache if present; null until known (or if the blog is down). */
function usePostCount(): number | null {
  const [count, setCount] = useState<number | null>(() => getCachedIndex()?.posts.length ?? null);
  useEffect(() => {
    if (count !== null) return;
    let live = true;
    fetchPosts().then((result) => {
      if (live && result.ok) setCount(result.data.posts.length);
    });
    return () => {
      live = false;
    };
  }, [count]);
  return count;
}
