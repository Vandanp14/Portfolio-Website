import banner from '../assets/fanatics-banner.jpg';
import { Shell } from './primitives';

/** Every figure traces to a line in the resume — see src/content/portfolio.ts. */
const metrics = [
  { value: '5', label: 'REST endpoints shipped', detail: "Product Builder's first API" },
  { value: '82K+', label: 'Records served', detail: '37 ms worst case' },
  { value: '36.5%', label: 'Card data recovered', detail: '' },
  { value: '3', label: 'Features to production', detail: '8 weeks' },
];

export function FanaticsBanner() {
  return (
    <section className="band band-slate relative" aria-label="Internship highlight">
      {/*
        Composition reasoning: the source is 2000x1337 (ratio ~1.496:1), a
        landscape frame with the full "Fanatics" wall wordmark running the
        width of the shot. aspect-[2000/1337] governs the height directly at
        every viewport, so the frame renders edge-to-edge and complete.
        The frame is shown uncropped at every width — no max-height cap — so
        the whole wall and the whole subject stay in view. This is the
        internship highlight, so the banner is allowed to be tall.
      */}
      <div className="relative w-full">
        <img
          src={banner}
          alt="Vandan Patel at the Fanatics office in New York, standing beside the Fanatics logo wall"
          width={2000}
          height={1337}
          loading="eager"
          decoding="async"
          className="aspect-[2000/1337] w-full object-cover object-center"
        />

        <div className="absolute bottom-4 left-4 right-4 max-w-[420px] rounded-[var(--r-md)] bg-[var(--bg)] px-4 py-3 shadow-[var(--shadow-sm)] sm:bottom-6 sm:left-6 sm:right-auto">
          <p className="label text-[var(--accent)]">Summer 2026</p>
          <p className="mt-1 text-[15px] font-semibold leading-snug text-[var(--text)]">
            Software Engineering Intern · Fanatics · New York
          </p>
        </div>
      </div>

      <Shell className="relative py-[clamp(48px,7vw,72px)]">
        <p className="reveal text-[15px] leading-[1.6] text-[var(--text-2)]">
          What the summer actually produced:
        </p>

        <dl
          className="reveal mt-8 grid grid-cols-2 gap-x-6 gap-y-9 border-t border-[var(--line)] pt-9 md:grid-cols-4"
          style={{ '--reveal-delay': '70ms' } as React.CSSProperties}
        >
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="reveal"
              style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}
            >
              <dd className="num font-display text-[clamp(2.1rem,4.4vw,3rem)] text-[var(--text)]">
                {metric.value}
              </dd>
              <dt className="label mt-2 text-[var(--text-3)]">{metric.label}</dt>
              {metric.detail && (
                <p className="mt-1 text-[13px] leading-[1.5] text-[var(--text-2)]">{metric.detail}</p>
              )}
            </div>
          ))}
        </dl>
      </Shell>
    </section>
  );
}
