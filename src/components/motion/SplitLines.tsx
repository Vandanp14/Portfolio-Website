import type { CSSProperties, ElementType } from 'react';

/**
 * Splits text into words that are clipped from below and rise into place,
 * staggered, the first time the element scrolls into view (`data-reveal="lines"`
 * in index.css). Words stay real text, so the heading still reads naturally to
 * screen readers and in find-in-page.
 *
 * `start` offsets the stagger index, so several SplitLines laid out as one
 * staggered composition continue a single cascade.
 */
export function SplitLines({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  start = 0,
  id,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  start?: number;
  id?: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag
      id={id}
      data-reveal="lines"
      className={className}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="sl-w" style={{ '--i': start + index } as CSSProperties}>
            {word}
          </span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
