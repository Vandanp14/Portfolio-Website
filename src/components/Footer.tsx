import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { navSections, profile, RESUME_URL } from '../content/portfolio';
import { goToSection } from '../lib/router';
import { Link } from './Link';
import { SplitLines } from './motion/SplitLines';
import { Shell } from './primitives';

const linkClass =
  'link-draw-in inline-flex min-h-[44px] items-center gap-1.5 text-[18px] tracking-[-0.01em] text-[var(--text)] sm:min-h-[36px]';

/**
 * The name set edge to edge. CSS gives a close first guess; once fonts load
 * the text is measured and scaled so it exactly spans the content width.
 */
function GiantName() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const text = box?.firstElementChild as HTMLElement | null;
    if (!box || !text) return;

    const fit = () => {
      text.style.fontSize = '100px';
      const natural = text.scrollWidth;
      const available = box.clientWidth;
      if (natural > 0 && available > 0) {
        text.style.fontSize = `${Math.floor((available / natural) * 100 * 100) / 100}px`;
      }
    };

    fit();
    void document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={boxRef} aria-hidden="true" className="w-full overflow-hidden">
      <SplitLines
        as="p"
        text={profile.name.toUpperCase()}
        className="t-display block w-max whitespace-nowrap pb-[0.04em] pr-[0.045em] text-[12.8vw] leading-[0.8] text-[var(--text)] min-[1440px]:text-[190px]"
      />
    </div>
  );
}

function Column({ title, delay, children }: { title: string; delay: number; children: ReactNode }) {
  return (
    <div className="reveal border-t border-[var(--line-strong)] pt-4" style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      <p className="t-eyebrow text-[var(--text-3)]">{title}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="band band-slate pt-[clamp(72px,9vw,128px)]">
      <Shell>
        <div className="grid gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          <Column title="Navigation" delay={0}>
            <nav aria-label="Footer">
              <ul className="flex flex-col">
                {navSections.map((section) => (
                  <li key={section.id}>
                    <button type="button" onClick={() => goToSection(section.id)} className={linkClass}>
                      {section.label}
                    </button>
                  </li>
                ))}
                <li>
                  <Link to="/blog" className={linkClass}>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to={RESUME_URL} className={linkClass}>
                    Résumé
                  </Link>
                </li>
              </ul>
            </nav>
          </Column>

          <Column title="Elsewhere" delay={80}>
            <ul className="flex flex-col">
              <li>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  GitHub <span className="arrow-nudge" aria-hidden="true">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  LinkedIn <span className="arrow-nudge" aria-hidden="true">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} className={linkClass}>
                  Email <span className="arrow-nudge" aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </Column>

          <Column title="Currently" delay={160}>
            <ul className="flex flex-col gap-4 text-[15px] leading-[1.4]">
              <li className="border-l border-[var(--line-strong)] pl-2.5 text-[var(--text)]">{profile.status}</li>
              <li className="border-l border-[var(--line-strong)] pl-2.5 text-[var(--text-2)]">{profile.location}</li>
            </ul>
          </Column>

          <Column title="Role" delay={240}>
            <p className="text-[15px] leading-[1.4] text-[var(--text)]">{profile.role}</p>
            <p className="mono mt-2 text-[13px] uppercase text-[var(--text-3)]">{profile.disciplines.join(' / ')}</p>
          </Column>
        </div>

        <div className="mt-[clamp(72px,10vw,160px)]">
          <GiantName />
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-[var(--line)] py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="t-index text-[var(--text-3)]">© 2026 {profile.name}</p>
          <p className="t-index text-[var(--text-3)]">Built with React, TypeScript and Tailwind</p>
          <button
            type="button"
            onClick={() => goToSection('top')}
            className="group t-eyebrow inline-flex min-h-[44px] items-center gap-2 self-start text-[var(--text)] sm:self-auto"
          >
            <span className="link-draw-in">Back to top</span>
            <span aria-hidden="true" className="inline-block transition-transform duration-[var(--t-base)] ease-[var(--ease-out-expo)] group-hover:-translate-y-1">
              ↑
            </span>
          </button>
        </div>
      </Shell>
    </footer>
  );
}
