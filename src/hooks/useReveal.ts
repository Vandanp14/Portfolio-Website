import { useEffect, type DependencyList } from 'react';

/**
 * Single page-wide observer for `.reveal` elements. Fires once per element —
 * a reveal that replays on every scroll-by reads as decoration, not craft.
 * Pass `deps` when `.reveal` nodes mount later (e.g. after an async load);
 * already-revealed nodes are skipped on each pass.
 */
export function useRevealObserver(deps: DependencyList = []) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => node.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
