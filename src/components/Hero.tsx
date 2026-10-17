import { useRef, type CSSProperties } from 'react';
import { profile, RESUME_URL } from '../content/portfolio';
import { navigate } from '../lib/router';
import { HeroField } from './HeroField';
import { Link } from './Link';
import { Scramble } from './motion/Scramble';
import { SplitLines } from './motion/SplitLines';
import { ButtonGhost, Shell } from './primitives';

/**
 * The headline is broken into four staggered lines, each indented to a
 * different column, and read as one sentence (one <h1>). Words come from
 * `profile.headline`, so editing the content keeps the layout.
 */
const words = profile.headline.split(/\s+/).filter(Boolean);
const breaks = [0, 2, 4, 6, words.length];
const lines = breaks.slice(0, -1).map((from, i) => ({
  text: words.slice(from, breaks[i + 1]).join(' '),
  start: from,
}));

/** Column offsets per line: mobile first, then the 12-col desktop stagger. */
const offsets = [
  'ml-[34%] md:ml-[41.666%]',
  'ml-0',
  'ml-0 md:ml-[16.666%]',
  'ml-[10%] md:ml-[33.333%]',
];

const meta = [
  { label: 'Status', value: profile.status },
  { label: 'Based in', value: profile.location },
  { label: 'Focus', value: profile.disciplines.join(' / ') },
  { label: 'Time', value: 'Scroll to explore' },
];

/** Cascade timing: the headline plays first, everything else follows it. */
const HEADLINE_MS = words.length * 55 + 500;

const display = 'text-[clamp(2.5rem,12vw,10rem)] md:text-[clamp(4rem,10vw,10rem)]';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="top"
      data-nav-section
      className="band band-paper relative flex min-h-[100svh] flex-col overflow-hidden pb-[clamp(48px,6vw,80px)] pt-[var(--nav-h)]"
    >
      <HeroField hostRef={sectionRef} />

      <Shell className="relative flex flex-1 flex-col">
        {/* Statement */}
        <div className="relative mt-[clamp(40px,9vh,112px)]">
          <h1 className={`t-display uppercase text-[var(--text)] ${display}`}>
            {lines.map((line, i) => (
              <SplitLines
                key={line.start}
                as="span"
                text={line.text}
                start={line.start}
                className={`block whitespace-nowrap ${offsets[i] ?? ''}`}
              />
            ))}
          </h1>

          <button
            type="button"
            onClick={() => {
              const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              document.getElementById('index')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
            }}
            aria-label="Scroll to the page index"
            className={`hover-glitch reveal t-display absolute bottom-0 right-0 flex min-h-[44px] min-w-[44px] items-end justify-end font-light text-[var(--text)] ${display}`}
            style={{ '--reveal-delay': `${HEADLINE_MS - 200}ms` } as CSSProperties}
          >
            <span className="arrow-nudge arrow-nudge-x" aria-hidden="true">
              <span className="glitch-target inline-block">→</span>
            </span>
          </button>
        </div>

        {/* Intro + CTAs, metadata column */}
        <div className="mt-[clamp(48px,7vw,96px)] grid gap-12 md:grid-cols-12 md:items-end md:gap-6">
          <div className="md:col-span-7 lg:col-span-6">
            <p
              className="reveal max-w-[46ch] text-[clamp(18px,1.5vw,20px)] leading-[1.45] text-[var(--text-2)]"
              style={{ '--reveal-delay': `${HEADLINE_MS}ms` } as CSSProperties}
            >
              {profile.intro}
            </p>

            <div
              className="reveal mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
              style={{ '--reveal-delay': `${HEADLINE_MS + 80}ms` } as CSSProperties}
            >
              <ButtonGhost onClick={() => navigate('/work')}>
                See the work
                <span className="arrow-nudge arrow-nudge-x" aria-hidden="true">
                  →
                </span>
              </ButtonGhost>
              <Link
                to={RESUME_URL}
                className="inline-flex min-h-[44px] items-center gap-1.5 text-[16px] text-[var(--text)]"
              >
                <span className="link-draw">Résumé</span>
                <span className="arrow-nudge" aria-hidden="true">↗</span>
              </Link>
              <ExternalTextLink href={profile.github} label="GitHub" />
              <ExternalTextLink href={profile.linkedin} label="LinkedIn" />
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-5 md:col-span-5 md:col-start-8 md:grid-cols-1 lg:col-span-4 lg:col-start-9">
            {meta.map((item, i) => (
              <div
                key={item.label}
                className="reveal border-l border-[var(--line-strong)] pl-2.5"
                style={{ '--reveal-delay': `${HEADLINE_MS + 120 + i * 70}ms` } as CSSProperties}
              >
                <dt>
                  <Scramble
                    text={`${item.label}:`}
                    delay={HEADLINE_MS + i * 90}
                    className="mono block text-[11px] uppercase tracking-[0.04em] text-[var(--text-3)]"
                  />
                </dt>
                <dd className="mt-1">
                  <Scramble
                    text={item.value}
                    delay={HEADLINE_MS + 120 + i * 90}
                    duration={1100}
                    replayOnHover
                    className="mono block text-[12px] uppercase leading-[1.45] tracking-[0.02em] text-[var(--text)]"
                  />
                </dd>
              </div>
            ))}
          </dl>
        </div>

      </Shell>
    </section>
  );
}

function ExternalTextLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[44px] items-center gap-1.5 text-[16px] text-[var(--text-2)] transition-colors duration-[var(--t-fast)] hover:text-[var(--text)]"
    >
      <span className="link-draw-in">{label}</span>
      <span className="arrow-nudge" aria-hidden="true">↗</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
