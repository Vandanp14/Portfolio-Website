# TRANSFORM_PLAN.md — portfolio editorial refresh

Brief: `docs/design-brief.md` · Baseline: `a2cfe7f`

- [x] Phase 1 — Audit and route/content preserve-list (`DESIGN_PLAN.md`, `PRODUCT.md`)
- [x] Phase 2 — Palette and typography direction (`docs/design-brief.md`, `src/index.css`)
- [x] Phase 3 — Homepage structure (`src/components/Hero.tsx`)
- [x] Phase 4 — Shared surfaces, navigation, stats, and image-led proof (`src/index.css`, `src/components/Nav.tsx`)
- [x] Phase 5 — Responsive, accessible, and reduced-motion pass
- [x] Phase 6 — Lint, TypeScript, production build, browser rendering review

## Preserve-list check

All routes and existing page implementations remain wired through `src/App.tsx`. Case study data and screenshots still come from `src/content/portfolio.ts`. The new lead screenshot uses the existing responsive image component and is eager-loaded. Focus visibility and the global reduced-motion policy remain active.
