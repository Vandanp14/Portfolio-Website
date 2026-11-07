import { featuredProjects, type Project, type ProjectShot } from '../content/portfolio';
import { usePageMeta } from '../lib/seo';
import { PageRows } from './PageRows';
import { Meta, PageTitle, Picture, SectionTitle, Shell, TextLink, Wide } from './primitives';

function Shot({ shot, sizes, eager = false }: { shot: ProjectShot; sizes: string; eager?: boolean }) {
  return (
    <figure className="min-w-0">
      <Picture
        image={shot.src}
        eager={eager}
        sizes={sizes}
        alt={shot.alt}
        className="h-auto w-full rounded-[6px] border border-[var(--line)]"
      />
      <figcaption className="t-meta mt-2 break-words">{shot.caption}</figcaption>
    </figure>
  );
}

export function ProjectDetail({ project }: { project: Project }) {
  usePageMeta({ title: project.title, description: project.tagline, path: `/work/${project.id}` });

  const wide = project.shots.filter((shot) => shot.kind === 'wide');
  const phones = project.shots.filter((shot) => shot.kind === 'phone');
  const [lead, ...moreWide] = wide;
  const next = featuredProjects[(featuredProjects.findIndex((item) => item.id === project.id) + 1) % featuredProjects.length];

  return (
    <Shell className="py-12 sm:py-16">
      <TextLink to="/work" className="t-meta">
        ← Work
      </TextLink>
      <div className="mt-6">
        <PageTitle>{project.title}</PageTitle>
        <Meta className="mt-2 break-words">
          <span className="tabular-nums">{project.year}</span> · {project.stack.join(', ')}
        </Meta>
      </div>

      <p className="mt-6 text-[18px] leading-[1.5] text-[var(--text)]">{project.tagline}</p>
      <p className="mt-4 text-[var(--text-2)]">{project.summary}</p>

      {(project.liveUrl || project.repoUrl || project.liveNote) && (
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {project.liveUrl && (
            <TextLink href={project.liveUrl}>
              Live site<span aria-hidden="true"> ↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </TextLink>
          )}
          {project.repoUrl && (
            <TextLink href={project.repoUrl}>
              Source<span aria-hidden="true"> ↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </TextLink>
          )}
          {project.liveNote && <Meta>{project.liveNote}</Meta>}
        </div>
      )}

      {lead && (
        <Wide className="mt-10">
          <Shot shot={lead} eager sizes="(min-width: 1000px) 960px, 100vw" />
        </Wide>
      )}

      <div className="mt-12">
        <SectionTitle>How it works</SectionTitle>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-[var(--text-2)] marker:text-[var(--text-3)]">
          {project.build.map((item) => (
            <li key={item} className="break-words">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {(moreWide.length > 0 || phones.length > 0) && (
        <div className="mt-12">
          <SectionTitle>Screenshots</SectionTitle>
          <Wide className="mt-4 flex flex-col gap-8">
            {moreWide.length > 0 && (
              <div className="grid items-start gap-6 sm:grid-cols-2">
                {moreWide.map((shot) => (
                  <Shot key={shot.src.img.src} shot={shot} sizes="(min-width: 640px) 470px, 100vw" />
                ))}
              </div>
            )}
            {phones.length > 0 && (
              <div className={`grid grid-cols-2 items-start gap-6 ${phones.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
                {phones.map((shot) => (
                  <Shot key={shot.src.img.src} shot={shot} sizes="(min-width: 640px) 300px, 50vw" />
                ))}
              </div>
            )}
          </Wide>
        </div>
      )}

      <div className="mt-16">
        <PageRows rows={[{ label: `Next: ${next.title}`, to: `/work/${next.id}` }]} />
      </div>
    </Shell>
  );
}
