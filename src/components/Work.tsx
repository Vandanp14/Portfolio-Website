import { ArrowUpRight, Github } from 'lucide-react';
import { featuredProjects } from '../content/portfolio';
import type { Project } from '../content/portfolio';
import { ButtonGhost, SectionHeading, Shell, Tag } from './primitives';

export function Work() {
  return (
    <section
      id="work"
      data-nav-section
      aria-labelledby="work-title"
      className="band band-mist relative overflow-hidden py-[var(--section)]"
    >
      <Shell>
        <SectionHeading
          index="01"
          kicker="Selected work"
          title="Things I built end to end."
          lede="Three products, start to finish — schema, backend, front end, deploy. Each one runs on real data: mine, or a team's with no engineer of their own."
          id="work-title"
        />

        <div className="mt-[clamp(64px,9vw,110px)] flex flex-col">
          {featuredProjects.map((project, i) => (
            <FeatureBlock key={project.id} project={project} index={i} />
          ))}
        </div>
      </Shell>
    </section>
  );
}

function FeatureBlock({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;
  const hasLinks = Boolean(project.liveUrl || project.repoUrl);
  const hasShots = project.shots.length > 0;

  return (
    <article
      className={`reveal ${
        index > 0
          ? 'mt-[clamp(64px,9vw,110px)] border-t border-[var(--line)] pt-[clamp(64px,9vw,110px)]'
          : ''
      }`}
      style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="label text-[var(--accent)]">{project.index}</span>
        <span className="h-px w-8 bg-[var(--line-strong)]" aria-hidden="true" />
        <span className="label text-[var(--text-3)]">{project.category}</span>
        <span className="h-px w-8 bg-[var(--line-strong)]" aria-hidden="true" />
        <span className="label text-[var(--text-3)]">{project.year}</span>
      </div>

      <h3 className="font-display mt-6 text-[clamp(1.9rem,4.2vw,2.8rem)] text-[var(--text)]">
        {project.title}
      </h3>
      <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.6] text-[var(--text-2)]">
        {project.tagline}
      </p>

      {/* The track sizes swap along with the order, so the prose column is
          always the wide one no matter which side it sits on. */}
      <div
        className={`mt-10 grid gap-10 lg:gap-16 ${
          isEven ? 'lg:grid-cols-[1fr_340px]' : 'lg:grid-cols-[340px_1fr]'
        }`}
      >
        <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
          <p className="text-[15px] leading-[1.65] text-[var(--text-2)]">{project.summary}</p>

          <ol className="mt-8 flex flex-col divide-y divide-[var(--line)] border-t border-[var(--line)]">
            {project.build.map((item, bi) => (
              <li key={bi} className="grid grid-cols-[28px_1fr] gap-4 py-4">
                <span className="mono text-[13px] text-[var(--text-3)]">
                  {String(bi + 1).padStart(2, '0')}
                </span>
                <span className="text-[15px] leading-[1.65] text-[var(--text-2)]">{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
          {/* Figures sit on hairlines rather than in a boxed grid — no frame,
              no fill, so they read as type rather than as tiles. */}
          <div className="grid grid-cols-3 gap-x-6 border-t border-[var(--line-strong)] pt-5 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-[var(--line)] lg:pt-0">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="lg:py-5 lg:first:pt-0 lg:last:pb-0">
                <div className="num font-display text-[clamp(1.6rem,3vw,2.4rem)] text-[var(--text)]">
                  {metric.value}
                </div>
                <div className="label mt-2 text-[var(--text-3)]">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-2">
        {project.stack.map((tech) => (
          <Tag key={tech}>{tech}</Tag>
        ))}
      </div>

      {hasLinks && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.liveUrl && (
            <ButtonGhost href={project.liveUrl} external>
              Open live
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </ButtonGhost>
          )}
          {project.repoUrl && (
            <ButtonGhost href={project.repoUrl} external>
              Source
              <Github className="h-4 w-4" aria-hidden="true" />
            </ButtonGhost>
          )}
        </div>
      )}

      {hasShots && (
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <span className="label text-[var(--text-3)]">Screens</span>
            {project.shots.length > 1 && <span className="label text-[var(--text-3)]">Swipe →</span>}
          </div>

          <div className="rail -mx-[var(--gutter)] mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-2">
            {project.shots.map((shot, si) => (
              <figure
                key={si}
                className={`flex-none snap-start ${
                  shot.kind === 'phone' ? 'w-[214px] sm:w-[248px]' : 'w-[min(620px,82vw)]'
                }`}
              >
                <div className={shot.kind === 'phone' ? 'device' : 'screen'}>
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    loading="lazy"
                    decoding="async"
                    className={`w-full object-cover ${
                      shot.kind === 'phone' ? 'aspect-[758/1400]' : 'aspect-[2940/1604]'
                    }`}
                  />
                </div>
                <figcaption className="label mt-3 text-[var(--text-3)]">{shot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
