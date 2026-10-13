import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navSections, RESUME_URL, type SectionId } from '../content/portfolio';
import { goToSection } from '../lib/router';
import { Link } from './Link';

/*
 * Nav is the one exception to the band system's no-hardcoded-colour rule.
 * It's `fixed` and floats above all four bands (cobalt, ink, citron, chalk)
 * at once as the page scrolls beneath it, so unlike an in-flow section it
 * has no single band to inherit variables from. It declares its own small,
 * fixed light palette once, as custom properties on the header's style prop, and
 * every className below reads those — never the band `--bg`/`--text`/etc.
 */
const navVars = {
  '--nav-fill': '#ffffff',
  '--nav-text': '#0B0D12',
  '--nav-text-dim': 'rgba(11, 13, 18, 0.58)',
  '--nav-line': 'rgba(11, 13, 18, 0.12)',
  '--nav-accent': '#1F6FEB',
} as React.CSSProperties;

export function Nav({ active, page = null }: { active: SectionId | null; page?: 'blog' | 'resume' | null }) {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (id: SectionId) => {
    setOpen(false);
    goToSection(id);
  };

  const onBlog = page === 'blog';
  const onResume = page === 'resume';

  const solid = lifted || open;

  return (
    <header
      style={navVars}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[var(--t-base)] ease-[var(--ease-standard)] ${
        solid
          ? 'border-b border-[var(--nav-line)] bg-[var(--nav-fill)]/90 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[var(--content)] items-center justify-between px-[var(--gutter)]">
        <button
          onClick={() => go('top')}
          className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em] text-[var(--nav-text)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--nav-accent)]" aria-hidden="true" />
          Vandan Patel
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
          {navSections.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`relative rounded-[8px] px-3 py-2 text-[14px] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] ${
                  isActive
                    ? 'text-[var(--nav-accent)]'
                    : 'text-[var(--nav-text-dim)] hover:text-[var(--nav-text)]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute inset-x-3 -bottom-[2px] h-[2px] rounded-full bg-[var(--nav-accent)]"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
          <Link
            to="/blog"
            aria-current={onBlog ? 'page' : undefined}
            className={`relative rounded-[8px] px-3 py-2 text-[14px] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] ${
              onBlog ? 'text-[var(--nav-accent)]' : 'text-[var(--nav-text-dim)] hover:text-[var(--nav-text)]'
            }`}
          >
            Blog
            {onBlog && (
              <span
                className="absolute inset-x-3 -bottom-[2px] h-[2px] rounded-full bg-[var(--nav-accent)]"
                aria-hidden="true"
              />
            )}
          </Link>
          <Link
            to={RESUME_URL}
            aria-current={onResume ? 'page' : undefined}
            className={`ml-2 inline-flex items-center gap-1 rounded-[8px] border px-3.5 py-2 text-[14px] font-medium transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] ${
              onResume
                ? 'border-[var(--nav-accent)] text-[var(--nav-accent)]'
                : 'border-[var(--nav-line)] text-[var(--nav-text)] hover:bg-[rgba(11,13,18,0.05)]'
            }`}
          >
            Résumé
          </Link>
        </nav>

        <button
          className="-mr-2 flex h-11 w-11 items-center justify-center text-[var(--nav-text)] md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--nav-line)] bg-[var(--nav-fill)] px-[var(--gutter)] pb-6 pt-2 md:hidden">
          {navSections.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`flex h-12 w-full items-center gap-2 rounded-[10px] px-3 text-left text-[16px] ${
                  isActive ? 'text-[var(--nav-accent)]' : 'text-[var(--nav-text-dim)]'
                }`}
              >
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--nav-accent)]" aria-hidden="true" />
                )}
                {item.label}
              </button>
            );
          })}
          <Link
            to="/blog"
            onClick={() => setOpen(false)}
            aria-current={onBlog ? 'page' : undefined}
            className={`flex h-12 w-full items-center gap-2 rounded-[10px] px-3 text-left text-[16px] ${
              onBlog ? 'text-[var(--nav-accent)]' : 'text-[var(--nav-text-dim)]'
            }`}
          >
            {onBlog && <span className="h-1.5 w-1.5 rounded-full bg-[var(--nav-accent)]" aria-hidden="true" />}
            Blog
          </Link>
          <Link
            to={RESUME_URL}
            onClick={() => setOpen(false)}
            aria-current={onResume ? 'page' : undefined}
            className={`mt-2 flex h-12 items-center gap-1.5 rounded-[10px] border px-3 text-[16px] font-medium ${
              onResume
                ? 'border-[var(--nav-accent)] text-[var(--nav-accent)]'
                : 'border-[var(--nav-line)] text-[var(--nav-text)]'
            }`}
          >
            Résumé
          </Link>
        </div>
      )}
    </header>
  );
}
