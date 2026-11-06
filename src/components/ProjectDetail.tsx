import type { Project } from '../content/portfolio';
import { usePageMeta } from '../lib/seo';
import { Meta, PageTitle, Picture, SectionTitle, Shell, TextLink, Wide } from './primitives';

export function ProjectDetail({ project }: { project: Project }) {
  usePageMeta({ title: project.title, description: project.tagline, path: `/work/${project.id}` });

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

      {project.shots.length > 0 && (
        <div className="mt-12">
          <SectionTitle>Screenshots</SectionTitle>
          <Wide className="mt-4">
            <div className="flex flex-wrap items-start gap-6">
              {project.shots.map((shot, i) => {
                const phone = shot.kind === 'phone';
                return (
                  <figure key={shot.src.img.src} className={phone ? 'w-[min(300px,100%)]' : 'w-full'}>
                    <Picture
                      image={shot.src}
                      eager={i === 0}
                      sizes={phone ? '(min-width: 340px) 300px, 100vw' : '(min-width: 1000px) 960px, 100vw'}
                      alt={shot.alt}
                      className="h-auto w-full rounded-[6px] border border-[var(--line)]"
                    />
                    <figcaption className="t-meta mt-2 break-words">{shot.caption}</figcaption>
                  </figure>
                );
              })}
            </div>
          </Wide>
        </div>
      )}
    </Shell>
  );
}
