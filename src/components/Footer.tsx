import { ArrowUpRight } from 'lucide-react';
import { profile, RESUME_URL } from '../content/portfolio';
import { scrollToSection } from '../hooks/useScrollSpy';
import { Shell } from './primitives';

const footerNavLinks: { id: 'work' | 'experience' | 'about' | 'contact'; label: string }[] = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="band band-slate border-t border-[var(--line)]">
      <Shell className="py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[15px] font-medium text-[var(--text)]">{profile.name}</p>
            <p className="label mt-1.5 text-[var(--text-3)]">{profile.role}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {footerNavLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="label text-[var(--text-2)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:text-[var(--accent)]"
              >
                {link.label}
              </button>
            ))}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group label inline-flex items-center gap-1 text-[var(--text-2)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:text-[var(--accent)]"
            >
              Résumé
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-[var(--t-fast)] ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </nav>
        </div>

        <div className="mt-10 h-px bg-[var(--line)]" aria-hidden="true" />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[var(--text-3)]">© 2026 {profile.name}</p>
          <p className="text-[13px] text-[var(--text-3)]">Built with React, TypeScript and Tailwind</p>
        </div>
      </Shell>
    </footer>
  );
}
