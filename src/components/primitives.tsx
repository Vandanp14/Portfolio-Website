import type { ImgHTMLAttributes, ReactNode } from 'react';
import { Link } from './Link';

/** The reading column: 640px of text inside a 20px gutter. */
export function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[var(--content)] px-[var(--gutter)] ${className}`}>{children}</div>;
}

/**
 * Breaks out of the reading column up to 960px, centred. Never wider than the
 * viewport minus the gutters, so it is safe at 320px.
 */
export function Wide({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative left-1/2 w-[min(var(--wide),calc(100vw-2*var(--gutter)))] -translate-x-1/2 ${className}`}
    >
      {children}
    </div>
  );
}

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="t-page text-[var(--text)]">{children}</h1>;
}

export function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="t-section text-[var(--text)]">
      {children}
    </h2>
  );
}

export function Meta({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`t-meta ${className}`}>{children}</p>;
}

/** Inline link. `to` navigates inside the app; `href` is external and opens a new tab. */
export function TextLink({
  to,
  href,
  children,
  className = '',
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  if (to) {
    return (
      <Link to={to} className={`text-link ${className}`}>
        {children}
      </Link>
    );
  }
  const external = href?.startsWith('http');
  return (
    <a
      href={href}
      className={`text-link ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

/** A 1px hairline. */
export function Rule({ strong = false, className = '' }: { strong?: boolean; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-px w-full ${strong ? 'bg-[var(--line-strong)]' : 'bg-[var(--line)]'} ${className}`}
    />
  );
}

const MIME: Record<string, string> = { avif: 'image/avif', webp: 'image/webp', jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png' };

/**
 * Responsive image from a vite-imagetools `&as=picture` import: AVIF, then
 * WebP, then the JPEG fallback, each with a width-based srcset. Width/height
 * come from the source so the box is reserved before load (no layout shift).
 * Lazy by default; pass `eager` for anything above the fold.
 */
export function Picture({
  image,
  sizes,
  eager = false,
  ...img
}: {
  image: ImagePicture;
  sizes: string;
  eager?: boolean;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'>) {
  const formats = Object.keys(image.sources);
  const fallback = formats[formats.length - 1];
  return (
    <picture>
      {Object.entries(image.sources)
        .filter(([format]) => format !== fallback)
        .map(([format, srcSet]) => (
          <source key={format} type={MIME[format]} srcSet={srcSet} sizes={sizes} />
        ))}
      <img
        src={image.img.src}
        srcSet={fallback ? image.sources[fallback] : undefined}
        sizes={sizes}
        width={image.img.w}
        height={image.img.h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        {...img}
      />
    </picture>
  );
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`t-meta ${className}`}>{children}</p>;
}

/** Older call sites (Work, Experience, About) until their rewrite. */
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
  /** @deprecated kept for older call sites. */
  editorial?: boolean;
  id?: string;
}) {
  return (
    <header>
      <Rule strong />
      <div className="mt-4 flex items-baseline justify-between gap-6">
        <Eyebrow>{kicker}</Eyebrow>
        <span className="t-meta">/{index}</span>
      </div>
      <h2 id={id} className="t-page mt-8 block max-w-[20ch] text-[var(--text)]">
        {title}
      </h2>
      {lede && <p className="mt-6 max-w-[56ch] text-[var(--text-2)]">{lede}</p>}
    </header>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border border-[var(--line)] px-2 py-[3px] text-[13px] text-[var(--text-2)]">
      {children}
    </span>
  );
}

const boxBase =
  'inline-flex min-h-[44px] items-center justify-center gap-3 border px-6 text-[16px] tracking-[-0.01em] transition-[background-color,color,border-color] duration-150 disabled:cursor-not-allowed disabled:opacity-50';

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
