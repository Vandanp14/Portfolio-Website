import { ArrowUpRight } from 'lucide-react';
import { otherProjects } from '../content/portfolio';
import { Shell } from './primitives';

export function OtherWork() {
  return (
    <div className="band band-mist pb-[var(--section)]">
      <Shell>
        <div className="reveal flex items-baseline justify-between border-t border-[var(--line)] pt-10">
          <span className="label text-[var(--text-3)]">Also built</span>
          <span className="label text-[var(--text-3)]">{otherProjects.length} projects</span>
        </div>

        <ul className="mt-6 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {otherProjects.map((project, i) => {
            const reveal = i < 6;
            return (
              <li
                key={project.id}
                className={`group grid gap-x-8 gap-y-3 py-6 transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] md:grid-cols-[140px_1fr] md:items-start md:py-7 ${
                  reveal ? 'reveal' : ''
                } ${project.url ? 'hover:bg-[var(--surface)]' : ''}`}
                style={reveal ? ({ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties) : undefined}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 md:flex-col md:items-start">
                  <span className="label text-[var(--text-3)]">{project.year}</span>
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {project.stack.map((tech) => (
                      <span key={tech} className="mono text-[11px] text-[var(--text-3)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[18px] font-medium text-[var(--text)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] group-hover:text-[var(--accent)]"
                    >
                      {project.title}
                      <ArrowUpRight
                        className="h-4 w-4 text-[var(--text-3)] transition-transform duration-[var(--t-fast)] ease-[var(--ease-out-expo)] group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    <span className="text-[18px] font-medium text-[var(--text)]">{project.title}</span>
                  )}
                  <p className="mt-2 max-w-[66ch] text-[15px] leading-[1.65] text-[var(--text-2)]">
                    {project.blurb}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Shell>
    </div>
  );
}
