import type { CSSProperties } from 'react';
import type { Project, ProjectShot } from '../content/portfolio';
import { Picture, Tag } from './primitives';

/** Intrinsic sizes of the exported screenshots — reserve space, avoid CLS. */
const SHOT_SIZE = {
  phone: { width: 758, height: 1400 },
  wide: { width: 2940, height: 1604 },
} as const;

const rise = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * The dark feature panel for one featured project. Rendered with a `key` by
 * the caller so every mount animation replays when the selected tab changes.
 */
export function ProjectPanel({ project, position }: { project: Project; position: number }) {
  const href = project.liveUrl ?? project.repoUrl;
  const hasShots = project.shots.length > 0;

  return (
    <div className="flex flex-col">
      <div className="anim-fade flex items-baseline justify-between gap-6" style={rise(0)}>
        <p className="t-eyebrow text-[var(--text-3)]">
          {project.category} <span aria-hidden="true">·</span> <span className="num">{project.year}</span>
        </p>
        <span className="t-index text-[var(--text-3)]">/0.{position + 1}</span>
      </div>

      <h3
        className="anim-rise mt-6 max-w-[22ch] text-[clamp(2.125rem,3.2vw,2.5rem)] leading-[1.05] tracking-[-0.035em] text-[var(--text)]"
        style={rise(1)}
      >
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="link-draw-in">
            {project.title}
            <span className="arrow-nudge ml-2 text-[var(--accent)]" aria-hidden="true">
              ↗
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          project.title
        )}
      </h3>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <p className="anim-rise max-w-[60ch] text-[18px] leading-[1.45] text-[var(--text-2)]" style={rise(2)}>
            {project.summary}
          </p>

          <p className="anim-fade t-eyebrow mt-10 text-[var(--text-3)]" style={rise(3)}>
            How it’s built
          </p>
          <ol className="mt-4 border-t border-[var(--line)]">
            {project.build.map((item, i) => (
              <li
                key={i}
                className="anim-rise grid grid-cols-[40px_minmax(0,1fr)] gap-4 border-b border-[var(--line)] py-4"
                style={rise(4 + i)}
              >
                <span className="t-index pt-[3px] text-[var(--text-3)]">/{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[16px] leading-[1.5] text-[var(--text-2)]">{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-10">
          <dl className="grid grid-cols-3 gap-x-5 border-t border-[var(--line-strong)] lg:grid-cols-1">
            {project.metrics.map((metric, i) => (
              <div
                key={metric.label}
                className="anim-rise flex flex-col pt-5 lg:border-b lg:border-[var(--line)] lg:pb-6"
                style={rise(3 + i)}
              >
                <dt className="t-eyebrow order-2 mt-2 text-[var(--text-3)]">{metric.label}</dt>
                <dd className="t-display num order-1 text-[clamp(2.75rem,6vw,5rem)] text-[var(--text)]">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="anim-fade" style={rise(7)}>
            <p className="t-eyebrow text-[var(--text-3)]">Stack</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {hasShots ? <ShotRail shots={project.shots} title={project.title} /> : <Placeholder project={project} />}
    </div>
  );
}

function ShotRail({ shots, title }: { shots: ProjectShot[]; title: string }) {
  return (
    <div className="mt-14">
      <div className="anim-fade flex items-baseline justify-between gap-6" style={rise(8)}>
        <p className="t-eyebrow text-[var(--text-3)]">Screens</p>
        {shots.length > 1 && (
          <p className="t-eyebrow text-[var(--text-3)]" aria-hidden="true">
            Scroll →
          </p>
        )}
      </div>

      <ul
        aria-label={`${title} screenshots`}
        tabIndex={0}
        className="rail -mx-[var(--pp)] mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-[var(--pp)] px-[var(--pp)] pb-2"
      >
        {shots.map((shot, i) => {
          const size = SHOT_SIZE[shot.kind];
          const isPhone = shot.kind === 'phone';
          return (
            <li
              key={shot.src.img.src}
              className={`anim-rise flex-none snap-start ${isPhone ? 'w-[200px] sm:w-[236px]' : 'w-[min(640px,78vw)]'}`}
              style={{ ...rise(i), '--anim-delay': '260ms' } as CSSProperties}
            >
              <figure>
                <div className={isPhone ? 'device' : 'screen'}>
                  <div
                    data-reveal="cover"
                    className={isPhone ? 'rounded-[21px]' : ''}
                    style={{ '--reveal-delay': `${i * 80}ms` } as CSSProperties}
                  >
                    <Picture
                      image={shot.src}
                      sizes={isPhone ? '(min-width: 640px) 236px, 200px' : 'min(640px, 78vw)'}
                      alt={shot.alt}
                      width={size.width}
                      height={size.height}
                      className="h-auto w-full object-cover"
                      style={{ aspectRatio: `${size.width} / ${size.height}` }}
                    />
                  </div>
                </div>
                <figcaption className="t-eyebrow mt-3 text-[var(--text-3)]">{shot.caption}</figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * For a project without screenshots: a typographic composition built from its
 * headline metric, plus the live link. Never an empty frame.
 */
function Placeholder({ project }: { project: Project }) {
  const lead = project.metrics[0];
  return (
    <div className="anim-clip mt-14 border-t border-[var(--line)] pt-8" style={{ ...rise(8), '--anim-delay': '200ms' } as CSSProperties}>
      <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
        {lead && (
          <p className="min-w-0">
            <span className="sr-only">
              {project.metrics.map((m) => `${m.value} ${m.label}`).join(', ')}
            </span>
            <span
              aria-hidden="true"
              className="t-display num block break-words text-[clamp(4.5rem,15vw,13rem)] uppercase text-transparent [-webkit-text-stroke:1px_var(--text)]"
            >
              {lead.value} {lead.label.split(' ').pop()}
            </span>
            <span aria-hidden="true" className="t-index mt-4 block text-[var(--text-3)]">
              {project.metrics
                .slice(1)
                .map((m) => `${m.value} ${m.label}`.toUpperCase())
                .join(' / ')}
            </span>
          </p>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-3 self-end justify-self-start border border-[var(--line-strong)] px-6 text-[16px] text-[var(--text)] transition-[background-color,color] duration-[var(--t-base)] ease-[var(--ease-out-expo)] hover:bg-[var(--text)] hover:text-[var(--bg)]"
          >
            Play it live
            <span className="arrow-nudge" aria-hidden="true">
              ↗
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  );
}
