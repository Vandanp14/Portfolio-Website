import type { CSSProperties } from 'react';

/** A 1px hairline that draws left to right the first time it scrolls into view. */
export function Rule({
  strong = false,
  delay = 0,
  className = '',
}: {
  strong?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      data-reveal="rule"
      className={`h-px w-full ${strong ? 'bg-[var(--line-strong)]' : 'bg-[var(--line)]'} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    />
  );
}
