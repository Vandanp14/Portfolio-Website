import { useId, useState, type CSSProperties } from 'react';
import type { Role } from '../content/portfolio';
import { experience } from '../content/portfolio';
import { Rule } from './motion/Rule';
import { Scramble } from './motion/Scramble';
import { SplitLines } from './motion/SplitLines';
import { SectionHeading, Shell } from './primitives';

/** Highlights shown before the disclosure on long roles. */
const PREVIEW = 4;

const pad = (n: number) => String(n).padStart(2, '0');

export function Experience() {
  return (
    <section
      id="experience"
      data-nav-section
      aria-labelledby="experience-title"
      className="band band-paper py-[var(--section)]"
    >
      <Shell>
        <SectionHeading
          index="0.2"
          kicker="Experience"
          title="Five roles, each one closer to the systems underneath."
          lede="From a university help desk to a distributed AI platform inside Fanatics — three years of internships that never stayed in one lane."
          id="experience-title"
        />

        <ol className="mt-[clamp(56px,7vw,96px)]">
          {experience.map((role, index) => (
            <RoleRow key={role.company} role={role} index={index} />
          ))}
        </ol>
        <Rule />
      </Shell>
    </section>
  );
}

function RoleRow({ role, index }: { role: Role; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const primary = Boolean(role.current);

  const collapsible = role.highlights.length > PREVIEW;
  const shown = collapsible ? role.highlights.slice(0, PREVIEW) : role.highlights;
  const rest = collapsible ? role.highlights.slice(PREVIEW) : [];

  return (
    <li>
      <Rule strong={primary} delay={index * 60} />

      <div
        className={`grid grid-cols-1 gap-x-[var(--gutter)] gap-y-8 lg:grid-cols-12 ${
          primary ? 'pb-[clamp(56px,7vw,96px)] pt-8 lg:pt-10' : 'pb-[clamp(40px,5vw,64px)] pt-6 lg:pt-8'
        }`}
      >
        {/* Left — company, summary, highlights, stack */}
        <div className="min-w-0 lg:col-span-8">
          <span className="t-index text-[var(--text-3)]">/0.{index + 1}</span>
          <SplitLines
            as="h3"
            text={role.company}
            className={`t-display mt-3 block text-[var(--text)] ${
              primary ? 'text-[clamp(3rem,7.5vw,6rem)]' : 'text-[clamp(2.25rem,4.4vw,3.75rem)]'
            }`}
          />

          <p
            className={`reveal mt-6 max-w-[58ch] leading-[1.4] text-[var(--text-2)] ${
              primary ? 'text-[20px] lg:text-[22px]' : 'text-[18px] lg:text-[20px]'
            }`}
            style={{ '--reveal-delay': '120ms' } as CSSProperties}
          >
            {role.summary}
          </p>

          <ol className={`${primary ? 'mt-10' : 'mt-7'} max-w-[72ch]`}>
            {shown.map((item, i) => (
              <Highlight key={item} text={item} n={i + 1} delay={180 + i * 60} />
            ))}
          </ol>

          {collapsible && (
            <>
              <div
                id={panelId}
                className={`grid transition-[grid-template-rows,visibility] duration-[var(--t-slow)] ease-[var(--ease-out-expo)] ${
                  expanded ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
                }`}
              >
                <ol className="min-h-0 max-w-[72ch] overflow-hidden" start={PREVIEW + 1}>
                  {rest.map((item, i) => (
                    <Highlight key={item} text={item} n={PREVIEW + i + 1} />
                  ))}
                </ol>
              </div>

              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setExpanded((v) => !v)}
                className="mono mt-4 inline-flex min-h-[44px] items-center gap-2 border-b border-[var(--line-strong)] text-[13px] uppercase tracking-[0.04em] text-[var(--text)] transition-colors duration-[var(--t-fast)] hover:text-[var(--accent)]"
              >
                {expanded ? 'Show fewer' : `Show all ${role.highlights.length}`}
                <span
                  aria-hidden="true"
                  className={`inline-block transition-transform duration-[var(--t-medium)] ease-[var(--ease-out-expo)] ${
                    expanded ? 'rotate-180' : ''
                  }`}
                >
                  ↓
                </span>
              </button>
            </>
          )}

          <p className="mono mt-8 text-[13px] leading-[1.6] text-[var(--text-3)]">
            <span className="sr-only">Stack: </span>
            {role.stack.join(' / ')}
          </p>
        </div>

        {/* Right — metadata column */}
        <dl className="flex flex-col gap-3 lg:col-span-3 lg:col-start-10 lg:pt-8">
          {role.current && (
            <div className="border-l border-[var(--signal)] pl-2.5">
              <dt className="sr-only">Status</dt>
              <dd className="t-eyebrow inline-flex items-center gap-2 text-[var(--text)]">
                <span aria-hidden="true" className="h-[7px] w-[7px] animate-pulse bg-[var(--signal)]" />
                Current
              </dd>
            </div>
          )}
          <Meta label="Title" value={role.title} />
          <Meta label="Period" value={role.period} scramble />
          <Meta label="Location" value={role.location} />
        </dl>
      </div>
    </li>
  );
}

function Highlight({ text, n, delay }: { text: string; n: number; delay?: number }) {
  return (
    <li
      className={`grid grid-cols-[2.25rem_1fr] gap-x-3 border-t border-[var(--line)] py-4 ${delay !== undefined ? 'reveal' : ''}`}
      style={delay !== undefined ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      <span aria-hidden="true" className="t-index pt-[3px] text-[var(--text-3)]">
        {pad(n)}
      </span>
      <span className="text-[16px] leading-[1.5] text-[var(--text-2)] md:text-[17px]">{text}</span>
    </li>
  );
}

function Meta({ label, value, scramble = false }: { label: string; value: string; scramble?: boolean }) {
  return (
    <div className="border-l border-[var(--line-strong)] pl-2.5">
      <dt className="sr-only">{label}</dt>
      <dd className="t-eyebrow text-[var(--text-2)]">
        {scramble ? <Scramble text={value.toUpperCase()} /> : value}
      </dd>
    </div>
  );
}
