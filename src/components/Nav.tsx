import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { RESUME_URL } from '../content/portfolio';
import { pageById, pages, type PageId } from '../lib/routes';
import { Link } from './Link';
import { MenuOverlay } from './MenuOverlay';
import { Scramble } from './motion/Scramble';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../lib/theme';
import { Wordmark } from './Wordmark';

/*
 * Nav is the one exception to the band system's no-hardcoded-colour rule.
 * It floats, inset, above every band as the page scrolls beneath it, so it
 * has no single band to inherit from. It declares one small light palette as
 * custom properties on the header and every className below reads those.
 */
const lightVars = {
  '--nav-fill': 'rgba(245, 246, 248, 0.98)',
  '--nav-text': '#10131A',
  '--nav-text-dim': 'rgba(16, 19, 26, 0.64)',
  '--nav-line': 'rgba(16, 19, 26, 0.76)',
  '--nav-invert': '#F5F6F8',
} as CSSProperties;

// Over a slate band the bar flips to a dark glass, so it never sits on the
// dark panels as a grey smear.
const darkVars = {
  '--nav-fill': 'rgba(9, 11, 16, 0.98)',
  '--nav-text': '#F7F8FC',
  '--nav-text-dim': 'rgba(247, 248, 252, 0.64)',
  '--nav-line': 'rgba(247, 248, 252, 0.76)',
  '--nav-invert': '#090B10',
} as CSSProperties;

// Top-bar links; the résumé gets the outlined box on the right instead.
const barPages = pages.filter((page) => page.id !== 'resume');

export function Nav({ current }: { current: PageId | null }) {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const [overSlate, setOverSlate] = useState(false);
  const [theme] = useTheme();
  // In the dark theme every band is dark, so the bar stays dark too.
  const dark = theme === 'dark' || overSlate;
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
      setOverSlate(Boolean(under?.closest('.band-slate')));
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
  }, [current]);

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

  const crumb = current ? pageById(current).label : null;

  return (
    <>
      <header
        ref={header}
        style={dark ? darkVars : lightVars}
        className="site-nav fixed inset-x-2 top-2 z-50 text-[var(--nav-text)] transition-colors duration-[var(--t-medium)] ease-[var(--ease-out-expo)] sm:inset-x-[10px] sm:top-[10px]"
      >
        <div
          className={`flex h-16 items-center justify-between gap-4 px-3 transition-[background-color,box-shadow,backdrop-filter] duration-[var(--t-medium)] ease-[var(--ease-out-expo)] sm:px-5 ${
            lifted
              ? 'bg-[var(--nav-fill)] shadow-[0_8px_30px_-18px_rgba(0,0,0,0.35)] backdrop-blur-xl'
              : 'bg-transparent'
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" aria-label="Vandan Patel — home">
              <Wordmark />
            </Link>
            {crumb && (
              <span className="hidden items-center gap-3 text-[19px] leading-none tracking-[-0.03em] text-[var(--nav-text-dim)] sm:flex">
                <span aria-hidden="true">/</span>
                <Scramble key={crumb} text={crumb} duration={600} />
              </span>
            )}
          </div>

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Pages">
            {barPages.map((item) => {
              const isActive = current === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-[16px] tracking-[-0.01em] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] ${
                    isActive ? 'text-[var(--nav-text)]' : 'text-[var(--nav-text-dim)] hover:text-[var(--nav-text)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-none items-center gap-3 sm:gap-4">
            <Link
              to={RESUME_URL}
              aria-current={current === 'resume' ? 'page' : undefined}
              className={`hidden h-10 w-[170px] items-center justify-center border border-[var(--nav-line)] text-[16px] tracking-[-0.01em] transition-colors duration-[var(--t-base)] ease-[var(--ease-out-expo)] hover:bg-[var(--nav-text)] hover:text-[var(--nav-invert)] sm:inline-flex ${
                current === 'resume' ? 'bg-[var(--nav-text)] text-[var(--nav-invert)]' : ''
              }`}
            >
              Résumé
            </Link>
            <ThemeToggle className="border-[var(--nav-line)] hover:bg-[var(--nav-text)] hover:text-[var(--nav-invert)]" />
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

      {open && <MenuOverlay onClose={close} current={current} />}
    </>
  );
}
