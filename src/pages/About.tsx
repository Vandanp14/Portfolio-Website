import { education, leadership, profile, recognition, skillGroups } from '../content/portfolio';
import { Eyebrow, SectionHead, Shell, TextLink } from '../components/specimen/primitives';

const PRINCIPLES = [
  {
    title: 'Deterministic first, model second',
    body: 'Readiness scores, TDEE, splits and safe-to-spend are computed in code before any model sees the data. Gemini writes the sentence; arithmetic stays in the database.',
  },
  {
    title: 'Read-only by default',
    body: 'The copilot at Fanatics cannot write. Any mutation fails at compile time, so a bad prompt is a failed build rather than a production incident.',
  },
  {
    title: 'Ship the boundary, not the demo',
    body: 'The interesting work is the seam: idempotent ingest, cent-exact remainder allocation, signed sessions, OpenAPI generated from the route table.',
  },
];

export default function AboutPage() {
  return (
    <div className="band band-paper">
      <section className="page-intro">
        <Shell>
          <Eyebrow>About — Vandan Patel</Eyebrow>
          <h1 className="display page-intro__claim" style={{ marginTop: 20 }}>
            Curious about the <em>seams</em>.
          </h1>
          <div className="page-intro__note">
            <p className="small col-7" style={{ maxWidth: '60ch' }}>
              {profile.intro}
            </p>
            <p className="small col-4 start-9 align-end">
              {profile.location}
              <br />
              Graduating December 2026
            </p>
          </div>
        </Shell>
      </section>

      <section className="section--tight">
        <Shell>
          <SectionHead
            index="01 — Principles"
            title={
              <>
                Three rules I keep <em>reaching for</em>.
              </>
            }
            note="Each one comes from a bug I shipped or a system I inherited."
          />
          <div className="caps" style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
            {PRINCIPLES.map((principle, i) => (
              <div className="cap" key={principle.title}>
                <p className="mono">{String(i + 1).padStart(2, '0')}</p>
                <p className="h3" style={{ marginTop: 10 }}>
                  {principle.title}
                </p>
                <p className="small" style={{ marginTop: 8 }}>
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </Shell>
      </section>

      <section className="section--tight">
        <Shell>
          <SectionHead
            index="02 — Toolkit"
            title={
              <>
                What I actually <em>reach for</em>.
              </>
            }
            note="Grouped by problem, not by logo wall."
          />
          <div className="caps" style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
            {skillGroups.slice(0, 3).map((group) => (
              <div className="cap" key={group.title}>
                <p className="h3">{group.title}</p>
                <p className="small" style={{ marginTop: 6 }}>
                  {group.note}
                </p>
                <ul className="cap__list">
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="caps" style={{ marginTop: 40 }}>
            {skillGroups.slice(3).map((group) => (
              <div className="cap" key={group.title}>
                <p className="h3">{group.title}</p>
                <p className="small" style={{ marginTop: 6 }}>
                  {group.note}
                </p>
                <ul className="cap__list">
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Shell>
      </section>

      <section className="section--tight">
        <Shell>
          <SectionHead
            index="03 — Record"
            title={
              <>
                Recognition and <em>responsibility</em>.
              </>
            }
            note={`${education.degree}, ${education.institution} · ${education.graduation}`}
          />
          <div className="grid" style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
            <div className="col-6">
              <Eyebrow>Recognition</Eyebrow>
              <ul className="notes notes--dated" style={{ marginTop: 12 }}>
                {recognition.map((item) => (
                  <li key={item.title}>
                    <span className="mono">{item.year}</span>
                    <span>
                      <span className="catalogue__title">{item.title}</span>
                      <span className="small" style={{ display: 'block', marginTop: 4 }}>
                        {item.org} — {item.note}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-6 start-7">
              <Eyebrow>Leadership</Eyebrow>
              <ul className="notes notes--dated" style={{ marginTop: 12 }}>
                {leadership.map((item) => (
                  <li key={item.role}>
                    <span className="mono">{item.period}</span>
                    <span>
                      <span className="catalogue__title">{item.role}</span>
                      <span className="small" style={{ display: 'block', marginTop: 4 }}>
                        {item.org} — {item.note}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p style={{ marginTop: 40 }}>
            <TextLink to="/work">See the work that came out of it</TextLink>
          </p>
        </Shell>
      </section>
    </div>
  );
}
