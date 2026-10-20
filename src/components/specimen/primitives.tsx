import type { CSSProperties, ImgHTMLAttributes, ReactNode } from 'react';
import { Link } from '../Link';

/** Page-width wrapper. Everything on the site sits inside one of these. */
export function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`shell ${className}`}>{children}</div>;
}

export function Rule({ strong = false, className = '' }: { strong?: boolean; className?: string }) {
  return <div className={`rule ${strong ? 'rule--strong' : ''} ${className}`} aria-hidden="true" />;
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Mono({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`mono ${className}`}>{children}</span>;
}

const MIME: Record<string, string> = {
  avif: 'image/avif',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
};

/**
 * Responsive image from a vite-imagetools `&as=picture` import. Width and
 * height come from the source, so the box is reserved before load.
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

/** The one rounded object on the site. Used for a single action per view. */
export function Pill({
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
  if (href) {
    return (
      <a className={`pill ${className}`} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link to={to ?? '/'} className={`pill ${className}`}>
      {children}
    </Link>
  );
}

/** Underlined text action. The arrow nudges on hover. */
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
  // Internal navigation points sideways; off-site links leave the page.
  const arrow = href ? '↗' : '→';
  const inner = (
    <>
      {children}
      <span className="arrow" aria-hidden="true">
        {arrow}
      </span>
    </>
  );
  if (href) {
    return (
      <a className={`link ${className}`} href={href} target="_blank" rel="noopener noreferrer">
        {inner}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link to={to ?? '/'} className={`link ${className}`}>
      {inner}
    </Link>
  );
}

type WordRiseProps = {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  delay?: number;
  style?: CSSProperties;
  /** Word indices rendered as italic accent (Instrument Serif italic). */
  accentWords?: number[];
};

/**
 * Masked word-by-word rise. Each word is clipped and translated up into
 * place, staggered by --i. One reveal, once — see src/lib/reveal.ts.
 */
export function WordRise({ text, as = 'span', className = '', delay = 0, style, accentWords }: WordRiseProps) {
  const Tag = as;
  const words = text.split(' ');
  return (
    <Tag
      className={className}
      data-reveal="lines"
      style={{ ['--reveal-delay' as string]: `${delay}ms`, ...style }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="word-mask">
            <span className="word-inner" style={{ ['--i' as string]: i }}>
              {accentWords?.includes(i) ? <em>{word}</em> : word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}

/** Section opener: index, claim and a note in the 12-column grid. */
export function SectionHead({
  index,
  title,
  note,
  id,
}: {
  index: string;
  title: ReactNode;
  note?: ReactNode;
  id?: string;
}) {
  return (
    <header className="section-head" id={id}>
      <p className="eyebrow section-head__index">{index}</p>
      <h2 className="h2 section-head__title">{title}</h2>
      {note ? <p className="small section-head__note">{note}</p> : null}
    </header>
  );
}

/** One number and its label. Tabular, mono, never decorative. */
export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric">
      <dd className="metric__value">{value}</dd>
      <dt className="metric__label">{label}</dt>
    </div>
  );
}
