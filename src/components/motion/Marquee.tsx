import type { CSSProperties, ReactNode } from 'react';

/**
 * Infinite horizontal track. Children render twice; the track slides half its
 * width and loops seamlessly. Pauses on hover. Under reduced motion the
 * duplicate is dropped and the items wrap statically.
 */
export function Marquee({
  children,
  duration = 40,
  className = '',
  label,
}: {
  children: ReactNode;
  /** Seconds per loop. */
  duration?: number;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`marquee overflow-hidden ${className}`}
      role={label ? 'region' : undefined}
      aria-label={label}
    >
      <div className="marquee-track" style={{ '--marquee-duration': `${duration}s` } as CSSProperties}>
        <div className="flex shrink-0">{children}</div>
        <div className="marquee-dup flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
