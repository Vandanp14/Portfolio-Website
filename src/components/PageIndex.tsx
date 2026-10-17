import { useEffect, useState, type CSSProperties } from 'react';
import { experience, featuredProjects, otherProjects, profile } from '../content/portfolio';
import { fetchPosts, getCachedIndex } from '../lib/blog';
import { pages, type PageDef, type PageId } from '../lib/routes';
import { Link } from './Link';
import { Rule } from './motion/Rule';
import { SplitLines } from './motion/SplitLines';
import { Eyebrow, Shell } from './primitives';

/**
 * The homepage's navigation: one full-width row per page, stacked like an
 * index. On hover (or keyboard focus) an ink fill wipes across the row and
 * the type inverts, so it reads unmistakably as something to press.
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
          <ul>
            {pages.map((page, i) => (
              <li key={page.id}>
                <IndexRow page={page} index={i} meta={meta[page.id]} />
              </li>
            ))}
          </ul>
          <Rule strong />
        </nav>
      </Shell>
    </section>
  );
}

export function IndexRow({ page, index, meta }: { page: PageDef; index: number; meta: string }) {
  return (
    <>
      <Rule strong delay={index * 80} />
      <Link
        to={page.path}
        aria-label={`${page.label} — ${page.teaser}`}
        className="group relative block overflow-hidden outline-none focus-visible:outline-none"
      >
        {/* Ink fill that wipes in from the left. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-left scale-x-0 bg-[var(--text)] transition-transform duration-[700ms] ease-[var(--ease-wipe)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
        <span className="relative grid grid-cols-12 items-end gap-x-4 px-2 py-5 transition-colors duration-[var(--t-medium)] ease-[var(--ease-out-expo)] group-hover:text-[var(--bg)] group-focus-visible:text-[var(--bg)] sm:px-4 md:gap-x-6 md:py-7">
          <span className="t-index col-span-12 mb-2 text-[var(--text-3)] transition-colors duration-[var(--t-medium)] group-hover:text-[var(--bg)] group-focus-visible:text-[var(--bg)] md:col-span-1 md:mb-0 md:self-start md:pt-3">
            /0.{index + 1}
          </span>
          <span className="col-span-10 md:col-span-7">
            <SplitLines
              text={page.label}
              start={index}
              delay={index * 60}
              className="t-display block text-[clamp(3rem,10vw,8.5rem)] uppercase transition-transform duration-[700ms] ease-[var(--ease-out-expo)] group-hover:translate-x-3 md:group-hover:translate-x-6"
            />
          </span>
          <span
            className="reveal col-span-12 mt-3 hidden text-[16px] leading-[1.4] text-[var(--text-2)] transition-colors duration-[var(--t-medium)] group-hover:text-[var(--bg)] group-focus-visible:text-[var(--bg)] md:col-span-3 md:mt-0 md:block md:pb-3"
            style={{ '--reveal-delay': `${200 + index * 60}ms` } as CSSProperties}
          >
            {page.teaser}
            <span className="mono mt-1 block min-h-[1.4em] text-[13px] uppercase tracking-[0.02em] opacity-80">{meta}</span>
          </span>
          <span
            aria-hidden="true"
            className="col-span-2 justify-self-end pb-1 text-[clamp(2rem,4vw,3.5rem)] leading-none md:col-span-1 md:pb-3"
          >
            <span className="inline-block transition-transform duration-[var(--t-medium)] ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </span>
        </span>
      </Link>
    </>
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
