import type { CSSProperties, ReactNode } from 'react';
import { Rule } from './motion/Rule';
import { SplitLines } from './motion/SplitLines';

export function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[var(--content)] px-[var(--gutter)] ${className}`}>
      {children}
    </div>
  );
}

/** 11px uppercase label — the small voice that sits above every large one. */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`t-eyebrow text-[var(--text-3)] ${className}`}>{children}</p>;
}

/**
 * Section opener: a strong hairline draws across, the eyebrow and mono index
 * sit on it, and the title rises word by word.
 */
export function SectionHeading({
  index,
  kicker,
  title,
  lede,
  id,
}: {
  index: string;
  kicker: string;
  title: string;
  lede?: string;
  /** @deprecated kept for older call sites; the display voice is uniform now. */
  editorial?: boolean;
  id?: string;
}) {
  return (
    <header>
      <Rule strong />
      <div className="mt-4 flex items-baseline justify-between gap-6">
        <Eyebrow>{kicker}</Eyebrow>
        <span className="t-index text-[var(--text-3)]">/{index}</span>
      </div>
      <SplitLines
        as="h2"
        id={id}
        text={title}
        className="t-title mt-8 block max-w-[20ch] text-[var(--text)]"
      />
      {lede && (
        <p
          className="reveal mt-6 max-w-[56ch] text-[18px] leading-[1.45] text-[var(--text-2)]"
          style={{ '--reveal-delay': '160ms' } as CSSProperties}
        >
          {lede}
        </p>
      )}
    </header>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="mono inline-flex items-center border border-[var(--line)] px-2 py-[3px] text-[11px] uppercase tracking-[0.04em] text-[var(--text-2)]">
      {children}
    </span>
  );
}

const boxBase =
  'inline-flex min-h-[44px] items-center justify-center gap-3 border px-6 text-[16px] tracking-[-0.01em] transition-[background-color,color,border-color] duration-[var(--t-base)] ease-[var(--ease-out-expo)] disabled:cursor-not-allowed disabled:opacity-50';

/** Solid ink box; inverts on hover. */
export function ButtonPrimary({
  children,
  onClick,
  type = 'button',
  disabled,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${boxBase} border-[var(--text)] bg-[var(--text)] text-[var(--bg)] hover:bg-transparent hover:text-[var(--text)] disabled:hover:bg-[var(--text)] disabled:hover:text-[var(--bg)] ${className}`}
    >
      {children}
    </button>
  );
}

/** Outlined box — the site's default call to action. Fills with ink on hover. */
export function ButtonGhost({
  children,
  href,
  onClick,
  external,
  className = '',
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  className?: string;
}) {
  const classes = `${boxBase} border-[var(--line-strong)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
