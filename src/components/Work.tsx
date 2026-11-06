import { featuredProjects, otherProjects, type SmallProject } from '../content/portfolio';
import { Link } from './Link';
import { SectionTitle } from './primitives';

const row = 'block border-t border-[var(--line)] py-5';

function RowBody({ title, year, text, stack, external }: { title: string; year: string; text: string; stack: string[]; external?: boolean }) {
  return (
    <>
      <span className="flex items-baseline justify-between gap-4">
        <span className="min-w-0 break-words text-[var(--text)]">
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

function OtherRow({ project }: { project: SmallProject }) {
  const body = <RowBody title={project.title} year={project.year} text={project.blurb} stack={project.stack} external={!!project.url} />;
  return (
    <li>
      {project.url ? (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className={`${row} hover:bg-[var(--surface)]`}>
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
      <ul className="border-b border-[var(--line)]">
        {featuredProjects.map((project) => (
          <li key={project.id}>
            <Link to={`/work/${project.id}`} className={`${row} hover:bg-[var(--surface)]`}>
              <RowBody title={project.title} year={project.year} text={project.tagline} stack={project.stack} />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-12">
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
