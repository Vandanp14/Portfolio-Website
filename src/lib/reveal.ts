// Page-wide reveal engine. One IntersectionObserver adds `.is-in` once per
// element carrying `.reveal` or `[data-reveal]` (see index.css for the
// variants). A MutationObserver feeds it nodes that mount later — lazy pages,
// async blog content, swapped tabs — so components never wire this up.
// A reveal that replays on every scroll-by reads as decoration, not craft, so
// each element fires exactly once.

const SELECTOR = '.reveal:not(.is-in), [data-reveal]:not(.is-in)';

// Chrome intersects a target with its OWN clip-path, so an element that starts
// fully clipped (clip / wipe) would never report as visible. Those are watched
// through their parent instead.
const CLIPPED = new Set(['clip', 'wipe']);

let started = false;

export function startReveals() {
  if (started || typeof window === 'undefined') return;
  started = true;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Observed node → the reveal elements it stands in for.
  const waiting = new Map<Element, Set<Element>>();

  const io = reduce
    ? null
    : new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            waiting.get(entry.target)?.forEach((node) => node.classList.add('is-in'));
            waiting.delete(entry.target);
            io?.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
      );

  const watch = (node: Element) => {
    if (!io) {
      node.classList.add('is-in');
      return;
    }
    const proxy = CLIPPED.has(node.getAttribute('data-reveal') ?? '') ? node.parentElement ?? node : node;
    const group = waiting.get(proxy);
    if (group) {
      group.add(node);
      return;
    }
    waiting.set(proxy, new Set([node]));
    io.observe(proxy);
  };

  const take = (root: ParentNode) => {
    if (root instanceof Element && root.matches(SELECTOR)) watch(root);
    root.querySelectorAll(SELECTOR).forEach(watch);
  };

  take(document);

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) =>
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) take(node);
      }),
    );
  }).observe(document.body, { childList: true, subtree: true });
}
