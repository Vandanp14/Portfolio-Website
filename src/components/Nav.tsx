import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { navSections, RESUME_URL, type SectionId } from '../content/portfolio';
import { scrollToSection } from '../hooks/useScrollSpy';

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

export function Nav({ active }: { active: SectionId }) {
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
    scrollToSection(id);
  };

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
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-1 rounded-[8px] border border-[var(--nav-line)] px-3.5 py-2 text-[14px] font-medium text-[var(--nav-text)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:bg-[rgba(11,13,18,0.05)]"
          >
            Résumé
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
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
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex h-12 items-center gap-1.5 rounded-[10px] border border-[var(--nav-line)] px-3 text-[16px] font-medium text-[var(--nav-text)]"
          >
            Résumé
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      )}
    </header>
  );
}
