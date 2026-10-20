import { education, experience } from '../content/portfolio';
import { Eyebrow, SectionHead, Shell } from '../components/specimen/primitives';

export default function ExperiencePage() {
  return (
    <div className="band band-paper">
      <section className="page-intro">
        <Shell>
          <Eyebrow>Experience — 2023 to present</Eyebrow>
          <h1 className="display page-intro__claim" style={{ marginTop: 20 }}>
            Four years of software that had to <em>keep working</em>.
          </h1>
          <div className="page-intro__note">
            <p className="small col-5">
              An enterprise internship, a developer role, a data role, and the operational jobs that
              taught me how systems fail in front of real people.
            </p>
            <p className="small col-4 start-9 align-end">
              {experience.length} roles · one degree · 2026
            </p>
          </div>
        </Shell>
      </section>

      <Shell>
        {experience.map((role) => (
          <article className="role" key={`${role.company}-${role.title}`}>
            <div className="role__head">
              <Eyebrow>{role.current ? 'Current' : role.period}</Eyebrow>
              <h2 className="h2" style={{ marginTop: 12, fontSize: 'clamp(1.75rem, 2.6vw, 2.25rem)' }}>
                {role.company}
              </h2>
              <p className="h3" style={{ marginTop: 8 }}>
                {role.title}
              </p>
              <p className="mono" style={{ marginTop: 12 }}>
                {role.period} · {role.location}
              </p>
            </div>

            <div className="role__body">
              <p className="body">{role.summary}</p>

              <ul className="notes" style={{ marginTop: 24 }}>
                {role.highlights.map((highlight, i) => (
                  <li key={i}>
                    <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                    <span className="small" style={{ color: 'var(--fg)' }}>
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mono" style={{ marginTop: 16 }}>
                {role.stack.join(' · ')}
              </p>
            </div>
          </article>
        ))}

        <div className="section--tight">
          <SectionHead
            index="Education"
            title={
              <>
                B.S. Computer Science, <em>SUNY Oswego</em>.
              </>
            }
            note={`${education.graduation} · ${education.location}`}
          />
          <ul className="cap__list" style={{ marginTop: 24 }}>
            {education.courses.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </div>
      </Shell>
    </div>
  );
}
