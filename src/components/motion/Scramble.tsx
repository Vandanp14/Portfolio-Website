import { useCallback, useEffect, useRef, useState, type ElementType } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#_<>+=';

/**
 * Decodes text from random glyphs to the real string, left to right — on first
 * view, and again on hover when `replayOnHover` is set. Best on short uppercase
 * mono labels. Screen readers get the real text from a visually hidden copy;
 * the animated glyphs are hidden from assistive tech.
 */
export function Scramble({
  text,
  as: Tag = 'span',
  className = '',
  duration = 900,
  delay = 0,
  replayOnHover = false,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  duration?: number;
  delay?: number;
  replayOnHover?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const [shown, setShown] = useState(text);

  const play = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(text);
      return;
    }
    cancelAnimationFrame(frame.current);
    const chars = Array.from(text);
    // Each character settles at its own time, biased left to right.
    const settleAt = chars.map((_, i) => (i / Math.max(chars.length, 1)) * duration * 0.7 + Math.random() * duration * 0.3);
    const begin = performance.now() + delay;

    const tick = (now: number) => {
      const t = now - begin;
      if (t < 0) {
        frame.current = requestAnimationFrame(tick);
        return;
      }
      let done = true;
      const next = chars
        .map((char, i) => {
          if (char === ' ' || t >= settleAt[i]) return char;
          done = false;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');
      setShown(next);
      if (!done) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration, delay]);

  useEffect(() => {
    setShown(text);
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        play();
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [text, play]);

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseEnter={replayOnHover ? play : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </Tag>
  );
}
