import type { CSSProperties } from 'react';
import { RESUME_URL, type SectionId } from '../content/portfolio';
import { goToSection } from '../lib/router';
import { usePageMeta } from '../lib/seo';
import { Link } from './Link';
import { SplitLines } from './motion/SplitLines';
import { Shell } from './primitives';

const sections: ({ label: string; id: SectionId } | { label: string; to: string })[] = [
  { label: 'Work', id: 'work' },
  { label: 'Writing', to: '/blog' },
  { label: 'Résumé', to: RESUME_URL },
  { label: 'Contact', id: 'contact' },
];

const lineClass = 't-display block uppercase text-[clamp(3.75rem,13vw,12rem)]';

export function NotFound() {
  usePageMeta({ title: 'Page not found', noindex: true });

  return (
    <section className="band band-paper flex min-h-[100svh] flex-col pt-[var(--nav-h)]">
      <Shell className="flex flex-1 flex-col justify-between gap-16 pb-[clamp(40px,6vw,80px)] pt-[clamp(32px,6vw,80px)]">
        <div className="flex items-baseline justify-between gap-6 border-t border-[var(--line-strong)] pt-4">
          <p className="t-eyebrow text-[var(--text-3)]">Error</p>
          <span className="t-index text-[var(--text-3)]">/404</span>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="text-[var(--text)]">
            <SplitLines text="404 /" className={`${lineClass} text-[var(--text-3)]`} />
            <SplitLines text="Page not" start={2} className={lineClass} />
            <SplitLines text="Found." start={4} className={lineClass} />
          </h1>

          <div className="reveal self-start lg:self-end" style={{ '--reveal-delay': '500ms' } as CSSProperties}>
            <Link
              to="/"
              aria-label="Back home"
              className="hover-glitch inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--text)] transition-colors duration-[var(--t-base)] ease-[var(--ease-out-expo)] hover:text-[var(--accent)]"
            >
              <span aria-hidden="true" className="glitch-target t-display block text-[clamp(5rem,16vw,14rem)]">
                →
              </span>
            </Link>
          </div>
        </div>

        <nav aria-label="Popular pages" className="border-t border-[var(--line)] pt-6">
          <p className="t-eyebrow text-[var(--text-3)]">Try instead</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
            {sections.map((item) => (
              <li key={item.label}>
                {'id' in item ? (
                  <button
                    type="button"
                    onClick={() => goToSection(item.id)}
                    className="inline-flex min-h-[44px] items-center gap-2 text-[20px] tracking-[-0.02em] text-[var(--text)]"
                  >
                    <span aria-hidden="true" className="text-[var(--text-3)]">↳</span>
                    <span className="link-draw-in">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    to={item.to}
                    className="inline-flex min-h-[44px] items-center gap-2 text-[20px] tracking-[-0.02em] text-[var(--text)]"
                  >
                    <span aria-hidden="true" className="text-[var(--text-3)]">↳</span>
                    <span className="link-draw-in">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[44ch] text-[18px] leading-[1.4] text-[var(--text-2)]">
            The page you were looking for has moved, or never existed.
          </p>
          <Link
            to="/"
            className="t-eyebrow inline-flex min-h-[44px] items-center gap-2 self-start text-[var(--text)] sm:self-auto"
          >
            <span aria-hidden="true">↳</span>
            <span className="link-draw-in">Back to index</span>
          </Link>
        </div>
      </Shell>
    </section>
  );
}
