import type { CSSProperties } from 'react';
import type { SkillGroup } from '../content/portfolio';
import { education, leadership, recognition, skillGroups } from '../content/portfolio';
import { Marquee } from './motion/Marquee';
import { Rule } from './motion/Rule';
import { SplitLines } from './motion/SplitLines';
import { SectionHeading, Shell } from './primitives';

const pad = (n: number) => String(n).padStart(2, '0');

const allSkills = Array.from(new Set(skillGroups.flatMap((group) => group.skills)));
const half = Math.ceil(allSkills.length / 2);
const skillsA = allSkills.slice(0, half);
const skillsB = allSkills.slice(half);

/* 5 groups on a 6-col grid: two wide cards, then three narrow ones. */
const cardSpan = ['lg:col-span-3', 'lg:col-span-3', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-2'];

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

      {/* Skill marquees — decorative; the same skills are listed in the cards below. */}
      <div aria-hidden="true" className="mt-[clamp(56px,7vw,96px)] border-y border-[var(--line)]" data-reveal="fade">
        <Marquee duration={60} className="py-5">
          <SkillWords words={skillsA} />
        </Marquee>
        <div className="border-t border-[var(--line)] [&_.marquee-track]:[animation-direction:reverse]">
          <Marquee duration={60} className="py-5">
            <SkillWords words={skillsB} muted />
          </Marquee>
        </div>
      </div>

      <Shell>
        {/* Skill groups */}
        <div className="mt-[clamp(56px,7vw,96px)]">
          <div className="flex items-baseline justify-between gap-6">
            <h3 className="t-eyebrow text-[var(--text-3)]">Toolkit</h3>
            <span className="t-index text-[var(--text-3)]">{pad(skillGroups.length)} groups</span>
          </div>
          <ul className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-6">
            {skillGroups.map((group, i) => (
              <SkillCard
                key={group.title}
                group={group}
                n={i + 1}
                className={`${cardSpan[i] ?? 'lg:col-span-2'} ${i === skillGroups.length - 1 ? 'md:col-span-2' : ''}`}
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

function SkillWords({ words, muted = false }: { words: string[]; muted?: boolean }) {
  return (
    <>
      {words.map((word) => (
        <span
          key={word}
          className={`t-display flex shrink-0 items-center whitespace-nowrap text-[clamp(2rem,4.6vw,3.5rem)] ${
            muted ? 'text-[var(--text-2)]' : 'text-[var(--text)]'
          }`}
        >
          {word}
          <span className="mx-[0.45em] inline-block h-[0.16em] w-[0.16em] bg-[var(--text-3)]" />
        </span>
      ))}
    </>
  );
}

function SkillCard({ group, n, className }: { group: SkillGroup; n: number; className: string }) {
  return (
    <li
      className={`reveal flex min-h-[300px] flex-col bg-[var(--surface)] p-6 md:p-8 ${className}`}
      style={{ '--reveal-delay': `${(n - 1) * 70}ms` } as CSSProperties}
    >
      <span className="t-index text-[var(--text-3)]">/{pad(n)}</span>
      <h4 className="mt-6 text-[clamp(1.75rem,2.6vw,2.125rem)] leading-[1.05] tracking-[-0.035em] text-[var(--text)]">
        {group.title}
      </h4>
      <p className="mt-3 max-w-[40ch] text-[16px] leading-[1.45] text-[var(--text-2)]">{group.note}</p>
      <ul className="mono mt-auto flex flex-wrap gap-x-3 gap-y-1.5 border-t border-[var(--line)] pt-5 text-[13px] leading-[1.5] text-[var(--text-2)]">
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
