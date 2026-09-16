import type { ReactNode } from 'react';

export function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[var(--content)] px-[var(--gutter)] ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  index,
  kicker,
  title,
  lede,
  editorial = false,
  id,
}: {
  index: string;
  kicker: string;
  title: string;
  lede?: string;
  editorial?: boolean;
  id?: string;
}) {
  return (
    <header className="reveal">
      <div className="flex items-center gap-3">
        <span className="label text-[var(--accent)]">{index}</span>
        <span className="h-px w-8 bg-[var(--line-strong)]" aria-hidden="true" />
        <span className="label text-[var(--text-3)]">{kicker}</span>
      </div>
      <h2
        id={id}
        className={`mt-5 max-w-[19ch] text-[clamp(2.25rem,5.2vw,3.9rem)] text-[var(--text)] ${
          editorial ? 'font-editorial' : 'font-display'
        }`}
      >
        {title}
      </h2>
      {lede && (
        <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.65] text-[var(--text-2)]">{lede}</p>
      )}
    </header>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="mono rounded-[6px] border border-[var(--line)] bg-[var(--surface-2)] px-2 py-1 text-[11px] text-[var(--text-2)]">
      {children}
    </span>
  );
}

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
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--r-md)] bg-[var(--accent)] px-6 py-3 text-[15px] font-semibold text-[var(--on-accent)] transition-[transform,background-color,opacity] duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:-translate-y-px hover:bg-[var(--accent-hover)] active:translate-y-0 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${className}`}
    >
      {children}
    </button>
  );
}

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
  const classes = `inline-flex items-center justify-center gap-2 rounded-[var(--r-md)] border border-[var(--line-strong)] px-6 py-3 text-[15px] font-medium text-[var(--text)] transition-[transform,border-color,background-color] duration-[var(--t-fast)] ease-[var(--ease-out-expo)] hover:-translate-y-px hover:border-[var(--text-3)] hover:bg-[var(--surface-2)] active:translate-y-0 active:scale-[0.985] ${className}`;

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
