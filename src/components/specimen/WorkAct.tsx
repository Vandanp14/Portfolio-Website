import type { Project, ProjectShot } from '../../content/portfolio';
import { Eyebrow, Picture, TextLink } from './primitives';

const SHOT_SIZE = {
  wide: '2940 / 1604',
  phone: '758 / 1400',
} as const;

/** A screenshot, framed on a paper mat with a mono caption. Never a shadow. */
export function Stage({
  shot,
  eager = false,
  sizes = '(max-width: 900px) 100vw, 58vw',
}: {
  shot: ProjectShot;
  eager?: boolean;
  sizes?: string;
}) {
  return (
    <figure className={`stage ${shot.kind === 'phone' ? 'stage--phone' : ''}`}>
      <div className="stage__frame" style={{ aspectRatio: SHOT_SIZE[shot.kind] }}>
        <Picture image={shot.src} sizes={sizes} alt={shot.alt} eager={eager} style={{ height: '100%', objectFit: 'cover' }} />
      </div>
      <figcaption className="stage__caption">
        <span className="mono">{shot.caption}</span>
        <span className="mono" aria-hidden="true">
          Fig. {shot.kind === 'phone' ? '02' : '01'}
        </span>
      </figcaption>
    </figure>
  );
}

/** Typographic plate for work with no screenshots — still evidence, never a hole. */
function Plate({ project }: { project: Project }) {
  return (
    <div className="stage plate">
      <div
        style={{
          padding: 'clamp(28px, 4vw, 56px)',
          minHeight: 300,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 40,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <Eyebrow>Shipped · demoed to executives</Eyebrow>
          <Eyebrow>No screenshot</Eyebrow>
        </div>
        <p className="display-sm" style={{ maxWidth: '16ch' }}>
          Five games, <em>one hub</em>.
        </p>
        <ul className="plate-list">
          {['2048', 'Hangman', 'Crossword', 'Memory', 'Higher / Lower'].map((game) => (
            <li key={game}>{game}</li>
          ))}
        </ul>
        <p className="mono">
          {project.metrics.map((metric) => `${metric.value} ${metric.label.toLowerCase()}`).join(' — ')}
        </p>
      </div>
    </div>
  );
}

/** Three phone screens side by side. One phone on a wide mat reads as a gap. */
export function PhoneRow({ shots, caption }: { shots: ProjectShot[]; caption?: string }) {
  const phones = shots.filter((shot) => shot.kind === 'phone').slice(0, 3);
  if (phones.length === 0) return null;

  return (
    <figure className="stage">
      <div className="phone-row">
        {phones.map((shot) => (
          <div className="phone-row__frame" key={shot.caption}>
            <Picture
              image={shot.src}
              sizes="(max-width: 900px) 30vw, 220px"
              alt={shot.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
      <figcaption className="stage__caption">
        <span className="mono">{caption ?? phones[0].caption}</span>
        <span className="mono" aria-hidden="true">
          Fig. 02
        </span>
      </figcaption>
    </figure>
  );
}

export function WorkAct({ project, position }: { project: Project; position: number }) {
  const shot = project.shots[0];
  const href = project.liveUrl ?? project.repoUrl;

  return (
    <article className="act" id={project.id}>
      <div className="act__head">
        <Eyebrow>
          {String(position + 1).padStart(2, '0')} — {project.category}
        </Eyebrow>
        <h3 className="display-sm" style={{ marginTop: 16 }}>
          {project.title}
        </h3>
        <p className="mono" style={{ marginTop: 12 }}>
          {project.year} · {project.stack.slice(0, 3).join(' / ')}
        </p>
        {href ? (
          <p style={{ marginTop: 20 }}>
            <TextLink href={href}>Open the live build</TextLink>
          </p>
        ) : null}
      </div>

      <div className="act__body">
        <p className="act__claim">{project.tagline}</p>
        <p className="body">{project.summary}</p>

        <dl className="metrics">
          {project.metrics.map((metric) => (
            <div className="metric" key={metric.label}>
              <dd className="metric__value">{metric.value}</dd>
              <dt className="metric__label">{metric.label}</dt>
            </div>
          ))}
        </dl>

        <div>
          <TextLink to={`/work#${project.id}`}>Read the case</TextLink>
        </div>

        {shot ? (
          shot.kind === 'phone' ? (
            <PhoneRow shots={project.shots} caption={shot.caption} />
          ) : (
            <Stage shot={shot} eager={position === 0} />
          )
        ) : (
          <Plate project={project} />
        )}
      </div>
    </article>
  );
}
