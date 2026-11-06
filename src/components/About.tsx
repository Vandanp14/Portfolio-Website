import { education, leadership, recognition, skillGroups } from '../content/portfolio';
import { Meta, SectionTitle } from './primitives';

export function About() {
  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="about-education">
        <SectionTitle id="about-education">Education</SectionTitle>
        <p className="mt-3 text-[var(--text)]">
          {education.degree}, {education.institution}
        </p>
        <Meta>
          {education.location} · {education.graduation}
        </Meta>
        <p className="mt-3 text-[var(--text-2)]">Coursework: {education.courses.join(', ')}.</p>
      </section>

      <section aria-labelledby="about-tools">
        <SectionTitle id="about-tools">Tools</SectionTitle>
        <dl className="mt-3 flex flex-col gap-3">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <dt className="text-[var(--text)]">{group.title}</dt>
              <dd className="text-[var(--text-2)]">{group.skills.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="about-recognition">
        <SectionTitle id="about-recognition">Recognition</SectionTitle>
        <ul className="mt-3 flex flex-col gap-4">
          {recognition.map((item) => (
            <li key={item.title}>
              <p className="text-[var(--text)]">{item.title}</p>
              <Meta>
                {item.org} · {item.year}
              </Meta>
              <p className="mt-1 text-[var(--text-2)]">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="about-leadership">
        <SectionTitle id="about-leadership">Leadership</SectionTitle>
        <ul className="mt-3 flex flex-col gap-4">
          {leadership.map((item) => (
            <li key={item.role + item.org}>
              <p className="text-[var(--text)]">
                {item.role}, {item.org}
              </p>
              <Meta>{item.period}</Meta>
              <p className="mt-1 text-[var(--text-2)]">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
