import { experience, featuredProjects, profile } from '../content/portfolio';
import { usePageMeta } from '../lib/seo';
import { SectionTitle, Shell, TextLink } from './primitives';
import { ProjectRows } from './Work';

export function Home() {
  usePageMeta({ title: `${profile.name} | ${profile.role}`, exactTitle: true, path: '/' });

  return (
    <Shell className="py-12 sm:py-16">
      <h1 className="t-name text-[var(--text)]">{profile.name}</h1>
      <div className="mt-6 flex flex-col gap-4 text-[var(--text-2)]">
        <p>I&apos;m a software engineer finishing a computer science degree at SUNY Oswego. I graduate in December 2026.</p>
        <p>
          At Fanatics, I built Product Builder&apos;s first API and an AI assistant that can read its data. Outside of
          work I build tools I use myself, like{' '}
          <TextLink to="/work/oswego-dining">a dining hall menu ranked by protein</TextLink> and{' '}
          <TextLink to="/work/centro">a campus bus tracker</TextLink>.
        </p>
      </div>

      <section className="mt-16" aria-labelledby="home-projects">
        <SectionTitle id="home-projects">Recent projects</SectionTitle>
        <div className="mt-4">
          <ProjectRows projects={featuredProjects.slice(0, 4)} />
        </div>
        <p className="mt-4">
          <TextLink to="/work">All projects</TextLink>
        </p>
      </section>

      <section className="mt-16" aria-labelledby="home-experience">
        <SectionTitle id="home-experience">Experience</SectionTitle>
        <ul className="mt-4 border-b border-[var(--line)]">
          {experience.slice(0, 3).map((role) => (
            <li key={role.company} className="border-t border-[var(--line)] py-4">
              <p className="text-[var(--text)]">{role.company}</p>
              <p className="flex flex-wrap justify-between gap-x-4 text-[var(--text-2)]">
                <span>{role.title}</span>
                <span className="t-meta tabular-nums">{role.period}</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <TextLink to="/experience">All experience</TextLink>
        </p>
      </section>
    </Shell>
  );
}
