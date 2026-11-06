import { profile } from '../content/portfolio';
import { Shell, TextLink } from './primitives';

export function Footer() {
  return (
    <footer className="mt-16">
      <Shell>
        <div className="flex flex-col gap-2 border-t border-[var(--line)] py-6 text-[14px] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[var(--text-2)]">{profile.name}</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-[var(--text-2)]">
            <TextLink href={`mailto:${profile.email}`}>Email</TextLink>
            <TextLink href={profile.github}>GitHub</TextLink>
            <TextLink href={profile.linkedin}>LinkedIn</TextLink>
          </p>
        </div>
      </Shell>
    </footer>
  );
}
