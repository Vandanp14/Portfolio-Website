import { experience } from '../../content/portfolio';
import { Eyebrow, SectionHead, Shell, TextLink } from './primitives';

export function Ledger({ full = false }: { full?: boolean }) {
  const rows = full ? experience : experience.slice(0, 4);

  return (
    <section className="band band-paper section">
      <Shell>
        <SectionHead
          index="03 — Record"
          title={
            <>
              Where the work <em>actually</em> happened.
            </>
          }
          note="Four years of production software: one enterprise internship, one developer role, one data role, and the operational jobs that taught me how systems fail."
        />

        <div className="ledger" style={{ marginTop: 'clamp(32px, 4vw, 56px)' }}>
          {rows.map((role) => (
            <div
              key={`${role.company}-${role.title}`}
              className={`ledger__row ${role.current ? 'ledger__row--current' : ''}`}
            >
              <div>
                <p className="ledger__org">
                  {role.current ? (
                    <>
                      <span className="dot" aria-hidden="true" />
                      <span className="sr-only">Current role: </span>
                    </>
                  ) : null}
                  {role.company}
                </p>
                <p className="ledger__role">{role.title}</p>
              </div>
              <p className="small" style={{ maxWidth: '46ch' }}>
                {role.summary}
              </p>
              <p className="ledger__period">
                {role.period}
                <br />
                {role.location}
              </p>
              <p className="ledger__stack">{role.stack.slice(0, 3).join(' · ')}</p>
            </div>
          ))}
        </div>

        {!full ? (
          <p style={{ marginTop: 32 }}>
            <TextLink to="/experience">The full record, with scope</TextLink>
          </p>
        ) : null}

        <div className="grid" style={{ marginTop: 'clamp(48px, 6vw, 80px)' }}>
          <div className="col-4">
            <Eyebrow>Education</Eyebrow>
          </div>
          <div className="col-8 start-5">
            <p className="h3">B.S. Computer Science — State University of New York at Oswego</p>
            <p className="small" style={{ marginTop: 8 }}>
              Expected December 2026 · Oswego, NY · Data structures, operating systems, systems
              programming, databases, AI, and programming languages.
            </p>
          </div>
        </div>
      </Shell>
    </section>
  );
}
