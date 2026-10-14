import type { CSSProperties } from 'react';
import banner from '../assets/fanatics-banner.jpg';
import { fanaticsHighlight as h } from '../content/portfolio';
import { Rule } from './motion/Rule';
import { Scramble } from './motion/Scramble';
import { SplitLines } from './motion/SplitLines';
import { Shell } from './primitives';

/** Fluid so each statement line holds one line at 1440 and still fits at 390. */
const statement = 'text-[clamp(2.1rem,9vw,8.75rem)]';

/**
 * Full-bleed slate feature panel for the internship: eyebrow, role, two huge
 * uppercase statement lines with a "progress" pill between them, the office
 * photo under a lifting shutter, then the headline numbers.
 */
export function FanaticsBanner() {
  const [first, second] = h.statement;
  const firstWords = first.split(/\s+/).length;

  return (
    <section className="band band-slate relative" aria-labelledby="fanatics-statement">
      <Shell className="py-[var(--section)]">
        <div className="flex items-baseline justify-between gap-6">
          <Scramble text={h.eyebrow} className="mono text-[12px] uppercase tracking-[0.04em] text-[var(--text-3)]" />
          <span className="t-index text-[var(--text-3)]" aria-hidden="true">
            /0.0
          </span>
        </div>
        <p
          className="reveal mt-5 max-w-[24ch] text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.15] tracking-[-0.03em] text-[var(--text)]"
          style={{ '--reveal-delay': '80ms' } as CSSProperties}
        >
          {h.role}
        </p>

        <h2 id="fanatics-statement" className={`t-display mt-[clamp(48px,7vw,104px)] uppercase ${statement}`}>
          <SplitLines as="span" text={first} className="block text-[var(--text)]" />
          <span
            aria-hidden="true"
            data-reveal="fade"
            className="progress-sweep my-[clamp(14px,2vw,28px)] flex h-11 items-center justify-center rounded-full border border-[var(--line)] md:h-14"
            style={{ '--reveal-delay': '300ms' } as CSSProperties}
          >
            <span className="mono relative z-[1] text-[11px] uppercase tracking-[0.08em] text-[var(--text-2)] md:text-[12px]">
              {h.progress}
            </span>
          </span>
          <SplitLines as="span" text={second} start={firstWords} className="block text-[var(--accent)]" />
        </h2>

        <div
          data-reveal="cover"
          className="mt-[clamp(48px,7vw,104px)] w-full"
          style={{ '--reveal-delay': '100ms' } as CSSProperties}
        >
          <img
            src={banner}
            alt={h.imageAlt}
            width={2000}
            height={1337}
            loading="lazy"
            decoding="async"
            className="aspect-[2000/1337] w-full object-cover object-center"
          />
        </div>

        <div className="mt-[clamp(48px,6vw,88px)]">
          <Rule />
          <dl className="grid grid-cols-2 gap-y-10 pt-8 md:grid-cols-4 md:pt-10">
            {h.metrics.map((metric, i) => (
              <div
                key={metric.label}
                className="reveal flex flex-col border-l border-[var(--line)] pl-3 pr-2 md:pl-5"
                style={{ '--reveal-delay': `${i * 80}ms` } as CSSProperties}
              >
                <dt className="mono mb-5 text-[11px] uppercase tracking-[0.04em] text-[var(--text-3)] md:mb-8">
                  <span aria-hidden="true">/0.{i + 1} </span>
                  {metric.label}
                </dt>
                <dd className="num t-display text-[clamp(2.75rem,6vw,5rem)] text-[var(--text)]">
                  {metric.value}
                </dd>
                {metric.detail && (
                  <dd className="mt-3 max-w-[24ch] text-[14px] leading-[1.45] text-[var(--text-2)]">
                    {metric.detail}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </Shell>
    </section>
  );
}
