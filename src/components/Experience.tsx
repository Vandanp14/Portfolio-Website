import { useState } from 'react';
import type { Role } from '../content/portfolio';
import { experience } from '../content/portfolio';
import { SectionHeading, Shell, Tag } from './primitives';

const HIGHLIGHT_PREVIEW_COUNT = 4;

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
          index="02"
          kicker="Experience"
          title="Five roles, one direction."
          editorial
          lede="From a university help desk to a distributed AI platform inside Fanatics — five roles over three years, each one closer to the systems that run underneath everything else."
          id="experience-title"
        />

        <ol className="mt-16 border-t border-[var(--line)] divide-y divide-[var(--line)]">
          {experience.map((role, index) => (
            <RoleRow key={role.company} role={role} index={index} />
          ))}
        </ol>
      </Shell>
    </section>
  );
}

function RoleRow({ role, index }: { role: Role; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = role.highlights.length > HIGHLIGHT_PREVIEW_COUNT;
  const hiddenCount = role.highlights.length - HIGHLIGHT_PREVIEW_COUNT;
  const visibleHighlights =
    collapsible && !expanded ? role.highlights.slice(0, HIGHLIGHT_PREVIEW_COUNT) : role.highlights;

  return (
    <li
      className="reveal grid gap-x-10 gap-y-6 py-[clamp(28px,4vw,44px)] lg:grid-cols-[240px_1fr]"
      style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}
    >
      <div className="flex flex-row flex-wrap items-start gap-x-4 gap-y-2 lg:flex-col lg:gap-2.5">
        <span className="label text-[var(--text-3)]">{role.period}</span>
        <span className="label text-[var(--text-3)]">{role.location}</span>
        {role.current && (
          <span className="label mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" aria-hidden="true" />
            Current
          </span>
        )}
      </div>

      <div>
        <p className="label text-[var(--accent)]">{role.company}</p>
        <h3 className="font-editorial mt-2 text-[clamp(1.6rem,3vw,2.1rem)] text-[var(--text)]">
          {role.title}
        </h3>
        <p className="mt-4 max-w-[64ch] text-[17px] leading-[1.7] text-[var(--text-2)]">
          {role.summary}
        </p>

        <ul className="mt-6 space-y-3">
          {visibleHighlights.map((highlight) => (
            <li
              key={highlight}
              className="max-w-[70ch] border-l border-[var(--line)] pl-5 text-[15px] leading-[1.7] text-[var(--text-2)] md:text-[16px]"
            >
              {highlight}
            </li>
          ))}
        </ul>

        {collapsible && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="label mt-5 text-[var(--text-3)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:text-[var(--accent)]"
          >
            {expanded ? 'Show less' : `Show ${hiddenCount} more`}
          </button>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {role.stack.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>
      </div>
    </li>
  );
}
