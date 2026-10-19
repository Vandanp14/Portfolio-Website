# TRANSFORM_PLAN.md — Systems atlas rebuild

Brief: `docs/design-brief.md` · Baseline: `81c6f32` · Stack: React 18 + TypeScript + Vite 5 + Tailwind 3

## Audit

The prior product-story iteration preserved the centered hero, showcase pattern, and project selector from the earlier site. The user rejected that as a reuse of the old layout. This pass replaces the main shell and page compositions, retaining only verified content, assets, route infrastructure, and working transport behavior.

## Work plan

- [x] Establish the systems-atlas direction and document the reference patterns.
- [x] Replace home, work, experience, about, contact, navigation, and footer with original page compositions.
- [x] Present actual screenshots and ordered engineering evidence; use labeled type for MINT where no screenshot exists.
- [x] Preserve the blog/résumé lazy routes, analytics, route metadata, theme control, skip navigation, and contact delivery.
- [x] Inspect home/work/contact at desktop and Work at a 390px mobile viewport; confirm mobile document width does not overflow.
- [x] Run ESLint and production build.
- [ ] Review preview deployment and update the existing unmerged PR; never merge into `main`.

## Preserve list

Verified project content remains in `src/content/portfolio.ts`; contact delivery uses `sendContact`; blog and résumé remain lazy loaded; route navigation and page analytics stay in place. No old feature-selector layout or component is rendered on the primary routes.

## Known limitation

This visual review used local browser renders. Mobile viewport inspection covered Work and confirmed a 390px document width; remaining pages still need mobile visual review in preview before treating the full responsive audit as complete.
