import { ArrowDown, ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { profile, RESUME_URL, stats } from '../content/portfolio';
import { scrollToSection } from '../hooks/useScrollSpy';
import { ButtonGhost, ButtonPrimary, Shell } from './primitives';

export function Hero() {
  return (
    <section
      id="top"
      data-nav-section
      className="band band-paper relative overflow-hidden pb-[clamp(56px,7vw,80px)] pt-[clamp(120px,15vw,180px)]"
    >
      <Shell className="relative">
        <div className="reveal flex items-start gap-3">
          <span className="relative mt-[5px] flex h-2 w-2 flex-none" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--signal)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--signal)]" />
          </span>
          <span className="label text-[var(--text-2)]">{profile.status}</span>
        </div>

        <h1
          className="reveal font-display mt-7 max-w-[16ch] text-[clamp(3rem,8vw,6.5rem)] text-[var(--text)]"
          style={{ '--reveal-delay': '60ms' } as React.CSSProperties}
        >
          {profile.headline}
        </h1>

        <p
          className="reveal mt-7 max-w-[62ch] text-[18px] leading-[1.7] text-[var(--text-2)]"
          style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
        >
          {profile.intro}
        </p>

        <div
          className="reveal mt-9 flex flex-wrap items-center gap-3"
          style={{ '--reveal-delay': '180ms' } as React.CSSProperties}
        >
          <ButtonPrimary onClick={() => scrollToSection('work')}>
            See the work
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </ButtonPrimary>
          <ButtonGhost href={RESUME_URL} external>
            Résumé
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </ButtonGhost>
          <div className="ml-1 flex items-center gap-1">
            <IconLink href={profile.github} label="GitHub">
              <Github className="h-[18px] w-[18px]" aria-hidden="true" />
            </IconLink>
            <IconLink href={profile.linkedin} label="LinkedIn">
              <Linkedin className="h-[18px] w-[18px]" aria-hidden="true" />
            </IconLink>
          </div>
        </div>
      </Shell>

      <Shell className="relative mt-[clamp(56px,7vw,88px)]">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-9 border-t border-[var(--line)] pt-9 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="reveal"
              style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}
            >
              <dd className="num font-display text-[clamp(2.1rem,4.4vw,3rem)] text-[var(--text)]">
                {stat.value}
                <span className="text-[var(--accent)]">{stat.suffix}</span>
              </dd>
              <dt className="mt-2 text-[14px] font-medium text-[var(--text)]">{stat.label}</dt>
              <p className="mt-1 text-[13px] leading-[1.5] text-[var(--text-3)]">{stat.note}</p>
            </div>
          ))}
        </dl>
      </Shell>
    </section>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-[var(--r-md)] text-[var(--text-2)] transition-colors duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
    >
      {children}
    </a>
  );
}
