import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { navSections, RESUME_URL, type SectionId } from '../content/portfolio';
import { goToSection } from '../lib/router';
import { Link } from './Link';
import { MenuOverlay } from './MenuOverlay';
import { Scramble } from './motion/Scramble';
import { Wordmark } from './Wordmark';

/*
 * Nav is the one exception to the band system's no-hardcoded-colour rule.
 * It floats, inset, above every band as the page scrolls beneath it, so it
 * has no single band to inherit from. It declares one small light palette as
 * custom properties on the header and every className below reads those.
 */
const lightVars = {
  '--nav-fill': 'rgba(246, 246, 246, 0.78)',
  '--nav-text': '#1E2124',
  '--nav-text-dim': 'rgba(30, 33, 36, 0.55)',
  '--nav-line': 'rgba(30, 33, 36, 0.9)',
  '--nav-invert': '#FFFFFF',
} as CSSProperties;

// Over a slate band the bar flips to a dark glass, so it never sits on the
// dark panels as a grey smear.
const darkVars = {
  '--nav-fill': 'rgba(30, 33, 36, 0.72)',
  '--nav-text': '#F4F4F2',
  '--nav-text-dim': 'rgba(244, 244, 242, 0.55)',
  '--nav-line': 'rgba(244, 244, 242, 0.85)',
  '--nav-invert': '#1E2124',
} as CSSProperties;

const crumbs = { blog: 'Blog', resume: 'Résumé' } as const;

export function Nav({ active, page = null }: { active: SectionId | null; page?: 'blog' | 'resume' | null }) {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const [dark, setDark] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setLifted(window.scrollY > 24);
      // What band is under the bar's midline? Skip the bar itself.
      const under = document
        .elementsFromPoint(window.innerWidth / 2, 42)
        .find((node) => !header.current?.contains(node));
      setDark(Boolean(under?.closest('.band-slate')));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [page]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => menuButton.current?.focus());
  };

  const sectionLabel = navSections.find((item) => item.id === active)?.label;
  const crumb = page ? crumbs[page] : sectionLabel;

  return (
    <>
      <header
        ref={header}
        style={dark ? darkVars : lightVars}
        className="fixed inset-x-2 top-2 z-50 text-[var(--nav-text)] transition-colors duration-[var(--t-medium)] ease-[var(--ease-out-expo)] sm:inset-x-[10px] sm:top-[10px]"
      >
        <div
          className={`flex h-16 items-center justify-between gap-4 px-3 transition-[background-color,box-shadow,backdrop-filter] duration-[var(--t-medium)] ease-[var(--ease-out-expo)] sm:px-5 ${
            lifted
              ? 'bg-[var(--nav-fill)] shadow-[0_8px_30px_-18px_rgba(0,0,0,0.35)] backdrop-blur-xl'
              : 'bg-transparent'
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => goToSection('top')} aria-label="Vandan Patel — back to top">
              <Wordmark />
            </button>
            {crumb && (
              <span className="hidden items-center gap-3 text-[19px] leading-none tracking-[-0.03em] text-[var(--nav-text-dim)] sm:flex">
                <span aria-hidden="true">/</span>
                <Scramble key={crumb} text={crumb} duration={600} />
              </span>
            )}
          </div>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Sections">
            {navSections.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToSection(item.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`text-[16px] tracking-[-0.01em] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] ${
                    isActive ? 'text-[var(--nav-text)]' : 'text-[var(--nav-text-dim)] hover:text-[var(--nav-text)]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <Link
              to="/blog"
              aria-current={page === 'blog' ? 'page' : undefined}
              className={`text-[16px] tracking-[-0.01em] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] ${
                page === 'blog' ? 'text-[var(--nav-text)]' : 'text-[var(--nav-text-dim)] hover:text-[var(--nav-text)]'
              }`}
            >
              Blog
            </Link>
          </nav>

          <div className="flex flex-none items-center gap-3 sm:gap-[30px]">
            <Link
              to={RESUME_URL}
              aria-current={page === 'resume' ? 'page' : undefined}
              className={`hidden h-10 w-[170px] items-center justify-center border border-[var(--nav-line)] text-[16px] tracking-[-0.01em] transition-colors duration-[var(--t-base)] ease-[var(--ease-out-expo)] hover:bg-[var(--nav-text)] hover:text-[var(--nav-invert)] sm:inline-flex ${
                page === 'resume' ? 'bg-[var(--nav-text)] text-[var(--nav-invert)]' : ''
              }`}
            >
              Résumé
            </Link>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex h-10 w-10 items-center justify-center border border-[var(--nav-line)] transition-colors duration-[var(--t-base)] ease-[var(--ease-out-expo)] hover:bg-[var(--nav-text)] hover:text-[var(--nav-invert)]"
            >
              <span className="burger" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && <MenuOverlay onClose={close} active={active} page={page} />}
    </>
  );
}
