import type { CSSProperties } from 'react';
import type { SkillGroup } from '../content/portfolio';
import { education, leadership, recognition, skillGroups } from '../content/portfolio';
import { Rule } from './motion/Rule';
import { SplitLines } from './motion/SplitLines';
import { SectionHeading, Shell } from './primitives';

const pad = (n: number) => String(n).padStart(2, '0');

export function About() {
  return (
    <section
      id="about"
      data-nav-section
      aria-labelledby="about-title"
      className="band band-mist overflow-hidden py-[var(--section)]"
    >
      <Shell>
        <SectionHeading
          index="0.3"
          kicker="About"
          title="How I got here."
          lede="SUNY Oswego computer science, internships that never stayed in one lane, and the two communities I keep showing up for outside of code."
          id="about-title"
        />
      </Shell>

      <Shell>
        {/* Skill groups */}
        <div className="about-toolkit mt-[clamp(72px,10vw,136px)]">
          <div className="flex items-baseline justify-between gap-6">
            <h3 className="t-eyebrow text-[var(--text-3)]">Toolkit</h3>
            <span className="t-index text-[var(--text-3)]">{pad(skillGroups.length)} disciplines</span>
          </div>
          <ul className="mt-5">
            {skillGroups.map((group, i) => (
              <SkillCard
                key={group.title}
                group={group}
                n={i + 1}
              />
            ))}
          </ul>
        </div>

        {/* Education — split */}
        <div className="mt-[var(--section)]">
          <Rule strong />
          <div className="mt-4 flex items-baseline justify-between gap-6">
            <p className="t-eyebrow text-[var(--text-3)]">Education</p>
            <span className="t-index text-[var(--text-3)]">/0.3.2</span>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-[var(--gutter)] gap-y-12 lg:grid-cols-12">
            <SplitLines
              as="h3"
              text={education.degree.toUpperCase()}
              className="t-display block text-[clamp(3rem,8.5vw,8.5rem)] text-[var(--text)] lg:col-span-7"
            />

            <div className="lg:col-span-5">
              <dl className="flex flex-col gap-3">
                {[
                  ['Institution', education.institution],
                  ['Location', education.location],
                  ['Graduation', education.graduation],
                ].map(([label, value], i) => (
                  <div
                    key={label}
                    className="reveal border-l border-[var(--line-strong)] pl-2.5"
                    style={{ '--reveal-delay': `${120 + i * 60}ms` } as CSSProperties}
                  >
                    <dt className="sr-only">{label}</dt>
                    <dd className="t-eyebrow text-[var(--text-2)]">{value}</dd>
                  </div>
                ))}
              </dl>

              <h4 className="t-eyebrow mt-12 text-[var(--text-3)]">Relevant coursework</h4>
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6">
                {education.courses.map((course, i) => (
                  <li
                    key={course}
                    className="reveal flex items-baseline gap-3 border-t border-[var(--line)] py-3 text-[16px] leading-[1.35] text-[var(--text-2)]"
                    style={{ '--reveal-delay': `${i * 40}ms` } as CSSProperties}
                  >
                    <span aria-hidden="true" className="t-index shrink-0 text-[var(--text-3)]">
                      {pad(i + 1)}
                    </span>
                    <span>{course}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recognition + leadership */}
        <div className="mt-[var(--section)] grid grid-cols-1 gap-x-[var(--gutter)] gap-y-16 lg:grid-cols-2">
          <HonorColumn
            title="Recognition"
            rows={recognition.map((r) => ({ key: r.title, title: r.title, org: r.org, when: r.year, note: r.note }))}
          />
          <HonorColumn
            title="Leadership"
            rows={leadership.map((l) => ({ key: l.role + l.org, title: l.role, org: l.org, when: l.period, note: l.note }))}
          />
        </div>
      </Shell>
    </section>
  );
}

function SkillCard({ group, n }: { group: SkillGroup; n: number }) {
  return (
    <li
      className="about-skill-row reveal grid gap-x-6 gap-y-3 border-t border-[var(--line)] py-6 md:grid-cols-12 md:items-start md:py-8"
      style={{ '--reveal-delay': `${Math.min(n - 1, 5) * 70}ms` } as CSSProperties}
    >
      <span className="t-index text-[var(--accent)] md:col-span-1">/{pad(n)}</span>
      <h4 className="text-[clamp(1.75rem,2.6vw,2.125rem)] leading-[1.05] tracking-[-0.035em] text-[var(--text)] md:col-span-3">
        {group.title}
      </h4>
      <p className="max-w-[38ch] text-[15px] leading-[1.5] text-[var(--text-2)] md:col-span-3">{group.note}</p>
      <ul className="about-skill-list mono flex flex-wrap gap-2 md:col-span-5">
        {group.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </li>
  );
}

type HonorRow = { key: string; title: string; org: string; when: string; note: string };

function HonorColumn({ title, rows }: { title: string; rows: HonorRow[] }) {
  return (
    <div>
      <Rule strong />
      <div className="mt-4 flex items-baseline justify-between gap-6">
        <h3 className="t-eyebrow text-[var(--text-3)]">{title}</h3>
        <span className="t-index text-[var(--text-3)]">{pad(rows.length)}</span>
      </div>
      <ul className="mt-8">
        {rows.map((row, i) => (
          <li
            key={row.key}
            className="reveal grid grid-cols-[1fr_auto] gap-x-6 border-t border-[var(--line)] py-6"
            style={{ '--reveal-delay': `${i * 80}ms` } as CSSProperties}
          >
            <div className="min-w-0">
              <p className="t-eyebrow text-[var(--text-3)]">{row.org}</p>
              <h4 className="mt-2 text-[clamp(1.375rem,2vw,1.625rem)] leading-[1.1] tracking-[-0.03em] text-[var(--text)]">
                {row.title}
              </h4>
              <p className="mt-3 max-w-[52ch] text-[16px] leading-[1.45] text-[var(--text-2)]">{row.note}</p>
            </div>
            <span className="t-index whitespace-nowrap pt-[2px] text-right text-[var(--text-3)]">{row.when}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
