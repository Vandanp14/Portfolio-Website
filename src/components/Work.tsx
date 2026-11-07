import { featuredProjects, otherProjects, type Project, type SmallProject } from '../content/portfolio';
import { Link } from './Link';
import { Picture, SectionTitle } from './primitives';

const row = 'group block border-t border-[var(--line)] py-5';

function RowBody({ title, year, text, stack, external }: { title: string; year: string; text: string; stack: string[]; external?: boolean }) {
  return (
    <>
      <span className="flex items-baseline justify-between gap-4">
        <span className="min-w-0 break-words text-[var(--text)] decoration-[var(--line-strong)] underline-offset-[0.2em] group-hover:underline">
          {title}
          {external && (
            <>
              <span aria-hidden="true"> ↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </>
          )}
        </span>
        <span className="t-meta shrink-0 tabular-nums">{year}</span>
      </span>
      <span className="mt-1 block break-words text-[var(--text-2)]">{text}</span>
      <span className="t-meta mt-1 block break-words">{stack.join(', ')}</span>
    </>
  );
}

/** Project rows with a thumbnail, used on /work and the home page. */
export function ProjectRows({ projects }: { projects: Project[] }) {
  return (
    <ul className="border-b border-[var(--line)]">
      {projects.map((project) => {
        const cover = project.shots.find((shot) => shot.kind === 'wide') ?? project.shots[0];
        return (
          <li key={project.id}>
            <Link
              to={`/work/${project.id}`}
              className={`${row} grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-[minmax(0,1fr)_176px]`}
            >
              <span className="block min-w-0">
                <RowBody title={project.title} year={project.year} text={project.tagline} stack={project.stack} />
              </span>
              {cover && (
                <Picture
                  image={cover.src}
                  sizes="(min-width: 640px) 176px, 100vw"
                  alt=""
                  className="aspect-[16/10] w-full rounded-[6px] border border-[var(--line)] object-cover object-top"
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function OtherRow({ project }: { project: SmallProject }) {
  const body = <RowBody title={project.title} year={project.year} text={project.blurb} stack={project.stack} external={!!project.url} />;
  return (
    <li>
      {project.url ? (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className={row}>
          {body}
        </a>
      ) : (
        <div className={row}>{body}</div>
      )}
    </li>
  );
}

export function Work() {
  return (
    <>
      <ProjectRows projects={featuredProjects} />

      <div className="mt-16">
        <SectionTitle>Other projects</SectionTitle>
        <ul className="mt-4 border-b border-[var(--line)]">
          {otherProjects.map((project) => (
            <OtherRow key={project.id} project={project} />
          ))}
        </ul>
      </div>
    </>
  );
}
