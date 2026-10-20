import { featuredProjects, otherProjects, type Project } from '../content/portfolio';
import { Link } from '../components/Link';
import { Eyebrow, Metric, SectionHead, Shell, TextLink } from '../components/specimen/primitives';
import { Stage, PhoneRow } from '../components/specimen/WorkAct';

function CaseStudy({ project, position }: { project: Project; position: number }) {
  const href = project.liveUrl ?? project.repoUrl;

  return (
    <article className="case" id={project.id}>
      <div className="case__hero">
        <div className="case__title">
          <Eyebrow>
            Case {String(position + 1).padStart(2, '0')} — {project.category} · {project.year}
          </Eyebrow>
          <h2 className="display-sm" style={{ marginTop: 16 }}>
            {project.title}
          </h2>
          <p className="lead" style={{ marginTop: 16, maxWidth: '34ch' }}>
            {project.tagline}
          </p>
        </div>

        <div className="case__links">
          {project.liveUrl ? <TextLink href={project.liveUrl}>Live build</TextLink> : null}
          {project.repoUrl ? <TextLink href={project.repoUrl}>Repository</TextLink> : null}
        </div>
      </div>

      <div className="case__body">
        <div className="case__notes">
          <p className="body">{project.summary}</p>

          <div style={{ marginTop: 'clamp(28px, 4vw, 44px)' }}>
            <Eyebrow>How it is built</Eyebrow>
            <ol className="notes" style={{ marginTop: 12 }}>
              {project.build.map((item, i) => (
                <li key={i}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="small" style={{ color: 'var(--fg)' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="case__spec">
          <dl className="spec-sheet">
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>Discipline</dt>
              <dd>{project.category}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{project.stack.join(', ')}</dd>
            </div>
            {href ? (
              <div>
                <dt>Link</dt>
                <dd>
                  <a className="link" href={href} target="_blank" rel="noopener noreferrer">
                    Open <span className="arrow" aria-hidden="true">↗</span>
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>

          <dl className="metrics" style={{ marginTop: 32 }}>
            {project.metrics.map((metric) => (
              <Metric key={metric.label} value={metric.value} label={metric.label} />
            ))}
          </dl>
        </aside>
      </div>

      {project.shots.length > 0 ? (
        <div className="shots">
          {project.shots
            .filter((shot) => shot.kind === 'wide')
            .map((shot) => (
              <div key={shot.caption} className="shots__wide">
                <Stage shot={shot} sizes="(max-width: 900px) 100vw, 1200px" />
              </div>
            ))}
          {project.shots.some((shot) => shot.kind === 'phone') ? (
            <div className="shots__wide">
              <PhoneRow shots={project.shots} />
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export default function WorkPage() {
  return (
    <div className="band band-paper">
      <section className="page-intro">
        <Shell>
          <Eyebrow>Work — 2024 to 2026</Eyebrow>
          <h1 className="display page-intro__claim" style={{ marginTop: 20 }}>
            Three products, <em>shipped</em> end to end.
          </h1>
          <div className="page-intro__note">
            <p className="small col-5">
              Each one runs in production or ships to real users. The notes below are the decisions,
              not the feature list.
            </p>
            <p className="small col-4 start-9 align-end">
              390 tests · 44 API routes · 11 data models
            </p>
          </div>
        </Shell>
      </section>

      <Shell>
        {featuredProjects.map((project, i) => (
          <CaseStudy key={project.id} project={project} position={i} />
        ))}
      </Shell>

      <section className="section">
        <Shell>
          <SectionHead
            index="The rest"
            title={
              <>
                Ten smaller builds, <em>same standard</em>.
              </>
            }
            note="Coursework and weekend projects that still had to compile, pass tests and survive a real user."
          />

          <div className="catalogue" style={{ marginTop: 'clamp(28px, 3vw, 40px)' }}>
            {otherProjects.map((project, i) => {
              const body = (
                <>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="catalogue__title">{project.title}</span>
                  <span className="catalogue__blurb">{project.blurb}</span>
                  <span className="catalogue__stack">{project.stack.join(' · ')}</span>
                  <span className="catalogue__year">
                    {project.year} {project.url ? '↗' : ''}
                  </span>
                </>
              );

              return project.url ? (
                <a
                  key={project.id}
                  className="catalogue__row"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {body}
                </a>
              ) : (
                <div key={project.id} className="catalogue__row">
                  {body}
                </div>
              );
            })}
          </div>

          <p style={{ marginTop: 32 }}>
            <Link to="/experience" className="link">
              Where these were built <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </p>
        </Shell>
      </section>
    </div>
  );
}
