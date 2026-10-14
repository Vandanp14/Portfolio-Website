// Page-wide reveal engine. One IntersectionObserver adds `.is-in` once per
// element carrying `.reveal` or `[data-reveal]` (see index.css for the
// variants). A MutationObserver feeds it nodes that mount later — lazy pages,
// async blog content, swapped tabs — so components never wire this up.
// A reveal that replays on every scroll-by reads as decoration, not craft, so
// each element fires exactly once.

const SELECTOR = '.reveal:not(.is-in), [data-reveal]:not(.is-in)';

let started = false;

export function startReveals() {
  if (started || typeof window === 'undefined') return;
  started = true;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const io = reduce
    ? null
    : new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            io?.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
      );

  const take = (root: ParentNode) => {
    const nodes: Element[] = [];
    if (root instanceof Element && root.matches(SELECTOR)) nodes.push(root);
    root.querySelectorAll(SELECTOR).forEach((node) => nodes.push(node));
    nodes.forEach((node) => (io ? io.observe(node) : node.classList.add('is-in')));
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
