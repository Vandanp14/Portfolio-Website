import type { CSSProperties } from 'react';
import { otherProjects } from '../content/portfolio';
import type { SmallProject } from '../content/portfolio';
import { SplitLines } from './motion/SplitLines';
import { Eyebrow, Shell } from './primitives';

export function OtherWork() {
  return (
    <section aria-labelledby="other-work-title" className="band band-mist py-[var(--section)]">
      <Shell>
        <div className="flex items-baseline justify-between gap-6">
          <Eyebrow>Also built</Eyebrow>
          <span className="t-index num text-[var(--text-3)]">
            {String(otherProjects.length).padStart(2, '0')} projects
          </span>
        </div>
        <SplitLines
          as="h2"
          id="other-work-title"
          text="Coursework, hackathons, and tools I needed."
          className="t-title mt-8 block max-w-[20ch] text-[var(--text)]"
        />

        <ul className="mt-[clamp(48px,6vw,80px)] grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {otherProjects.map((project, i) => (
            <li
              key={project.id}
              className="reveal flex"
              style={{ '--reveal-delay': `${(i % 3) * 90}ms` } as CSSProperties}
            >
              <Card project={project} />
            </li>
          ))}
        </ul>
      </Shell>
    </section>
  );
}

function Card({ project }: { project: SmallProject }) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-4">
        <span className="t-index num text-[var(--text-3)]">{project.year}</span>
        {project.url ? (
          <span aria-hidden="true" className="arrow-nudge text-[20px] leading-none text-[var(--text)]">
            ↗
          </span>
        ) : (
          <span aria-hidden="true" className="block h-2 w-2 bg-[var(--line-strong)]" />
        )}
      </div>

      <h3 className="mt-10 text-[clamp(1.625rem,2.3vw,2.125rem)] leading-[1.06] tracking-[-0.035em] text-[var(--text)]">
        {project.title}
        {project.url && <span className="sr-only"> (opens in a new tab)</span>}
      </h3>
      <p className="mt-4 text-[16px] leading-[1.5] text-[var(--text-2)]">{project.blurb}</p>
      <p className="mono mt-auto pt-8 text-[12px] uppercase tracking-[0.02em] text-[var(--text-3)]">
        {project.stack.join(' / ')}
      </p>
    </>
  );

  const base = 'flex w-full flex-col bg-[var(--surface)] p-6 md:p-[30px]';

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} transition-colors duration-[var(--t-base)] ease-[var(--ease-out-expo)] hover:bg-[var(--surface-2)]`}
      >
        {body}
      </a>
    );
  }
  return <article className={base}>{body}</article>;
}
