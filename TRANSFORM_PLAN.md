# TRANSFORM_PLAN.md — portfolio editorial refresh

Brief: `docs/design-brief.md` · Baseline: `a2cfe7f`

- [x] Phase 1 — Audit and route/content preserve-list (`DESIGN_PLAN.md`, `PRODUCT.md`)
- [x] Phase 2 — Palette and typography direction (`docs/design-brief.md`, `src/index.css`)
- [x] Phase 3 — Homepage structure and route directory (`src/components/Hero.tsx`, `src/components/PageIndex.tsx`)
- [x] Phase 4 — Case-study viewer, experience rail, toolkit, shared surfaces (`src/components/ProjectPanel.tsx`, `src/components/Experience.tsx`, `src/components/About.tsx`, `src/index.css`)
- [x] Phase 5 — Navigation, responsive, accessible, reduced-motion pass (`src/components/Nav.tsx`)
- [x] Phase 6 — Lint, TypeScript, production build, and desktop/mobile route rendering review

## Preserve-list check

All routes and existing page implementations remain wired through `src/App.tsx`. Case study data and screenshots still come from `src/content/portfolio.ts`. The homepage lead and each case-study lead use the existing responsive image component. Keyboard-operable project selection, contact form, resume, blog, theme control, and visible focus remain active. Reveal motion resolves to its static state under reduced motion. Desktop and narrow mobile rendering were reviewed on home, work, about, experience, and contact routes.
