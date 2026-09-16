import type { SkillGroup } from '../content/portfolio';
import { education, leadership, recognition, skillGroups } from '../content/portfolio';
import { SectionHeading, Shell, Tag } from './primitives';

export function About() {
  return (
    <section
      id="about"
      data-nav-section
      aria-labelledby="about-title"
      className="band band-mist border-t border-[var(--line)] pb-[var(--section)] pt-[var(--section)]"
    >
      <Shell>
        <SectionHeading
          index="03"
          kicker="Background"
          title="How I got here."
          editorial
          lede="SUNY Oswego computer science, four years of internships that never stayed in one lane, and the two communities I keep showing up for outside of code."
          id="about-title"
        />

        {/* Education */}
        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <h3 className="font-editorial text-[clamp(1.5rem,3vw,1.9rem)] text-[var(--text)]">
              {education.degree}
            </h3>
            <p className="mt-3 text-[15px] text-[var(--text-2)]">{education.institution}</p>
            <p className="label mt-2 text-[var(--text-3)]">
              {education.location} · {education.graduation}
            </p>
          </div>

          <div className="reveal" style={{ '--reveal-delay': '70ms' } as React.CSSProperties}>
            <p className="label text-[var(--text-3)]">Relevant coursework</p>
            <ul className="mt-4 grid grid-cols-1 border-t border-[var(--line)] sm:grid-cols-2">
              {education.courses.map((course, index) => (
                <li
                  key={course}
                  className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] py-3 text-[15px] text-[var(--text-2)] sm:odd:pr-6 sm:even:pl-6"
                >
                  <span>{course}</span>
                  <span className="mono shrink-0 text-[12px] text-[var(--text-3)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skills */}
        <dl className="mt-24 border-t border-[var(--line)]">
          {skillGroups.map((group) => (
            <SkillRow key={group.title} group={group} />
          ))}
        </dl>

        {/* Recognition + Leadership */}
        <div className="reveal mt-24 border-t border-[var(--line-strong)] pt-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="label text-[var(--text-3)]">Recognition</p>
              <div className="mt-6 divide-y divide-[var(--line)]">
                {recognition.map((item) => (
                  <div key={item.title} className="py-5 first:pt-0 last:pb-0">
                    <h4 className="font-editorial text-[clamp(1.15rem,2vw,1.3rem)] text-[var(--text)]">
                      {item.title}
                    </h4>
                    <p className="label mt-2 text-[var(--text-3)]">
                      {item.org} · {item.year}
                    </p>
                    <p className="mt-2 text-[15px] leading-[1.6] text-[var(--text-2)]">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="label text-[var(--text-3)]">Leadership</p>
              <div className="mt-6 divide-y divide-[var(--line)]">
                {leadership.map((item) => (
                  <div key={item.role} className="py-5 first:pt-0 last:pb-0">
                    <h4 className="font-editorial text-[clamp(1.15rem,2vw,1.3rem)] text-[var(--text)]">
                      {item.role}
                    </h4>
                    <p className="label mt-2 text-[var(--text-3)]">
                      {item.org} · {item.period}
                    </p>
                    <p className="mt-2 text-[15px] leading-[1.6] text-[var(--text-2)]">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}

function SkillRow({ group }: { group: SkillGroup }) {
  return (
    <div className="reveal grid gap-3 border-b border-[var(--line)] py-8 md:grid-cols-[260px_1fr] md:gap-8">
      <div>
        <dt className="text-[17px] font-medium text-[var(--text)]">{group.title}</dt>
        <dd className="mt-1 text-[13px] text-[var(--text-3)]">{group.note}</dd>
      </div>
      <dd className="flex flex-wrap content-start gap-2">
        {group.skills.map((skill) => (
          <Tag key={skill}>{skill}</Tag>
        ))}
      </dd>
    </div>
  );
}
