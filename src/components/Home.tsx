import { profile } from '../content/portfolio';
import { pages } from '../lib/routes';
import { usePageMeta } from '../lib/seo';
import { PageRows } from './PageRows';
import { Shell, TextLink } from './primitives';

export function Home() {
  usePageMeta({ title: `${profile.name} — ${profile.role}`, exactTitle: true, path: '/' });

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
      <div className="mt-12">
        <PageRows rows={pages.map((page) => ({ label: page.label, to: page.path }))} />
      </div>
    </Shell>
  );
}
