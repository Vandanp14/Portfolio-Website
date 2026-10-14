import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { navSections, profile, RESUME_URL, type SectionId } from '../content/portfolio';
import { fetchPosts, formatDate, getCachedIndex, type PostSummary } from '../lib/blog';
import { goToSection } from '../lib/router';
import { Link } from './Link';
import { Shell } from './primitives';
import { Wordmark } from './Wordmark';

type Posts = { status: 'loading' } | { status: 'ready'; posts: PostSummary[] } | { status: 'error' };

/**
 * Full-screen slate menu: three hairline-topped columns — navigation in large
 * type, the latest writing, and elsewhere-links. Traps focus, closes on Esc,
 * and restores focus to the menu button (handled by Nav's `onClose`).
 */
export function MenuOverlay({
  onClose,
  active,
  page,
}: {
  onClose: () => void;
  active: SectionId | null;
  page: 'blog' | 'resume' | null;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [crossed, setCrossed] = useState(false);
  const [posts, setPosts] = useState<Posts>(() => {
    const cached = getCachedIndex();
    return cached ? { status: 'ready', posts: cached.posts.slice(0, 2) } : { status: 'loading' };
  });

  useEffect(() => {
    closeButton.current?.focus();
    // Let the burger mount as three lines, then morph to ✕.
    const frame = requestAnimationFrame(() => setCrossed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (posts.status !== 'loading') return;
    let live = true;
    fetchPosts().then((result) => {
      if (!live) return;
      setPosts(result.ok ? { status: 'ready', posts: result.data.posts.slice(0, 2) } : { status: 'error' });
    });
    return () => {
      live = false;
    };
  }, [posts.status]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !panel.current) return;
    const focusable = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const go = (id: SectionId) => {
    onClose();
    goToSection(id);
  };

  const bigLink =
    'group flex items-baseline gap-4 py-1 text-left text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.15] tracking-[-0.035em] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)]';
  const linkTone = (on: boolean) => (on ? 'text-[var(--text)]' : 'text-[var(--text-2)] hover:text-[var(--text)]');

  let i = 0;
  const stagger = () => ({ '--i': i++ }) as CSSProperties;

  return (
    <div
      id="site-menu"
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      onKeyDown={onKeyDown}
      className="menu-overlay band band-slate fixed inset-0 z-[60] overflow-y-auto"
    >
      <div className="px-2 pt-2 sm:px-[10px] sm:pt-[10px]">
        <div className="flex h-16 items-center justify-between px-3 sm:px-5">
          <Link to="/" onClick={onClose} aria-label="Vandan Patel — home">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-3 sm:gap-[30px]">
            <Link
              to={RESUME_URL}
              onClick={onClose}
              className="hidden h-10 w-[170px] items-center justify-center border border-[var(--line-strong)] text-[16px] tracking-[-0.01em] transition-colors duration-[var(--t-base)] ease-[var(--ease-out-expo)] hover:bg-[var(--text)] hover:text-[var(--bg)] sm:inline-flex"
            >
              Résumé
            </Link>
            <button
              ref={closeButton}
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center border border-[var(--line-strong)] bg-[var(--text)] text-[var(--bg)] transition-colors duration-[var(--t-base)] ease-[var(--ease-out-expo)] hover:bg-transparent hover:text-[var(--text)]"
            >
              <span className={`burger ${crossed ? 'is-open' : ''}`} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </div>

      <Shell className="grid gap-12 pb-16 pt-10 lg:grid-cols-3 lg:gap-[30px] lg:pt-14">
        <section aria-labelledby="menu-nav">
          <ColumnHead id="menu-nav" title="Navigation" />
          <nav className="mt-8 flex flex-col" aria-labelledby="menu-nav">
            <button type="button" onClick={() => go('top')} className={`anim-rise ${bigLink} ${linkTone(false)}`} style={stagger()}>
              Index
            </button>
            {navSections.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                aria-current={active === item.id ? 'true' : undefined}
                className={`anim-rise ${bigLink} ${linkTone(active === item.id)}`}
                style={stagger()}
              >
                <span className="text-[0.6em] text-[var(--text-3)]" aria-hidden="true">↳</span>
                {item.label}
              </button>
            ))}
            <div className="anim-rise" style={stagger()}>
              <Link
                to="/blog"
                onClick={onClose}
                aria-current={page === 'blog' ? 'page' : undefined}
                className={`${bigLink} ${linkTone(page === 'blog')}`}
              >
                Writing
              </Link>
            </div>
            <div className="anim-rise" style={stagger()}>
              <Link
                to={RESUME_URL}
                onClick={onClose}
                aria-current={page === 'resume' ? 'page' : undefined}
                className={`${bigLink} ${linkTone(page === 'resume')}`}
              >
                Résumé
              </Link>
            </div>
          </nav>
        </section>

        <section aria-labelledby="menu-writing" className="anim-rise" style={{ '--i': 3 } as CSSProperties}>
          <ColumnHead
            id="menu-writing"
            title="Latest writing"
            action={
              <Link to="/blog" onClick={onClose} className="t-eyebrow link-draw text-[var(--text)]">
                All posts ↗
              </Link>
            }
          />
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {posts.status === 'loading' &&
              [0, 1].map((n) => (
                <div key={n} aria-hidden="true">
                  <div className="skeleton h-3 w-24" />
                  <div className="skeleton mt-4 h-5 w-full" />
                  <div className="skeleton mt-2 h-5 w-3/4" />
                </div>
              ))}
            {posts.status === 'ready' &&
              posts.posts.map((post) => (
                <article key={post.id}>
                  {post.date && <p className="t-eyebrow text-[var(--text-3)]">{formatDate(post.date)}</p>}
                  <h3 className="mt-3 text-[20px] leading-[1.25] tracking-[-0.02em] text-[var(--text)]">{post.title}</h3>
                  <Link
                    to={`/blog/${post.id}`}
                    onClick={onClose}
                    className="mt-5 inline-flex items-baseline gap-2 text-[17px] text-[var(--text)]"
                    aria-label={`Read ${post.title}`}
                  >
                    <span aria-hidden="true">↳</span>
                    <span className="link-draw">Read here</span>
                  </Link>
                </article>
              ))}
            {(posts.status === 'error' || (posts.status === 'ready' && posts.posts.length === 0)) && (
              <p className="text-[18px] leading-[1.4] text-[var(--text-2)]">
                Notes on systems, tools and the things I ship live on the{' '}
                <Link to="/blog" onClick={onClose} className="link-draw text-[var(--text)]">
                  blog
                </Link>
                .
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby="menu-elsewhere" className="anim-rise" style={{ '--i': 4 } as CSSProperties}>
          <ColumnHead id="menu-elsewhere" title="Elsewhere" />
          <p className="mt-8 max-w-[30ch] text-[22px] leading-[1.25] tracking-[-0.02em] text-[var(--text)]">
            {profile.status}.
          </p>
          <ul className="mt-10 flex flex-col gap-3 text-[18px]">
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-draw-in text-[var(--text)]">
                GitHub <span className="arrow-nudge" aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link-draw-in text-[var(--text)]">
                LinkedIn <span className="arrow-nudge" aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className="link-draw-in text-[var(--text)]">
                {profile.email}
              </a>
            </li>
            <li>
              <a href="/resume.pdf" className="link-draw-in text-[var(--text)]">
                Résumé PDF <span className="arrow-nudge" aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
          <p className="t-eyebrow mt-10 text-[var(--text-3)]">{profile.location}</p>
        </section>
      </Shell>
    </div>
  );
}

function ColumnHead({ id, title, action }: { id: string; title: string; action?: ReactNode }) {
  return (
    <div className="border-t border-[var(--line-strong)] pt-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className="t-eyebrow text-[var(--text-3)]">
          {title}
        </h2>
        {action}
      </div>
    </div>
  );
}
