import { profile, stats } from '../../content/portfolio';
import { Link } from '../Link';
import { Eyebrow, Pill, Shell, TextLink, WordRise } from './primitives';

const SPEC = [
  { label: 'Focus', value: 'Distributed systems · Applied AI' },
  { label: 'Based', value: 'Oswego, New York' },
  { label: 'Graduating', value: 'December 2026' },
  { label: 'Status', value: 'Software Engineering Intern, Fanatics' },
];

export function Hero() {
  return (
    <section className="hero">
      <Shell>
        <div className="hero__status">
          <Eyebrow>Portfolio — 2026 edition</Eyebrow>
          <span className="rule" aria-hidden="true" />
          <span className="mono">SUNY Oswego · B.S. Computer Science</span>
        </div>

        <div className="hero__grid">
          <div className="hero__main">
            <WordRise
              as="h1"
              className="display hero__claim"
              text="I ship the layer everyone else depends on."
              accentWords={[6, 7]}
            />

            <p className="lead hero__intro">
              Software engineer at Fanatics, where I built Product Builder’s first API and the first
              agent on their internal platform to read non-GitHub data. Before that: four years of
              production software for a university, and three products shipped end to end on my own
              time.
            </p>

            <div className="hero__actions">
              <Pill to="/work">Selected work</Pill>
              <TextLink href={`mailto:${profile.email}`}>Email me</TextLink>
            </div>
          </div>

          <aside className="hero__aside" aria-label="At a glance">
            <div className="specimen">
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 2px 10px' }}>
                <Eyebrow>Specimen 01</Eyebrow>
                <Eyebrow>2026</Eyebrow>
              </div>
              <div
                style={{
                  borderTop: '1px solid var(--line-strong)',
                  borderBottom: '1px solid var(--line)',
                  padding: '20px 2px',
                }}
              >
                <p className="eyebrow" style={{ marginBottom: 8 }}>
                  Currently
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.75rem',
                    lineHeight: 1.05,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Software Engineering Intern, Fanatics
                </p>
              </div>
              <dl>
                {SPEC.map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '9px 2px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    <dt className="mono" style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {row.label}
                    </dt>
                    <dd className="mono" style={{ textAlign: 'right', color: 'var(--fg)', fontSize: '0.75rem' }}>
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>

        <div className="hero__meta">
          {stats.slice(0, 3).map((stat) => (
            <div key={stat.label}>
              <p className="metric__value" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.625rem)' }}>
                {stat.value}
                {stat.suffix}
              </p>
              <p className="small" style={{ marginTop: 6 }}>
                {stat.label} · {stat.note}
              </p>
            </div>
          ))}
          <div className="hero__meta-link">
            <Link to="/work" className="mono link-mono">
              Three products, end to end ↓
            </Link>
          </div>
        </div>
      </Shell>
    </section>
  );
}
