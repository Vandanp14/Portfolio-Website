# TRANSFORM_PLAN.md — product-story portfolio revamp

Brief: `docs/design-brief.md` · Review baseline: `95548f1` · Stack: React 18 + TypeScript + Vite 5 + Tailwind 3

## Audit

The prior iteration changed the palette and added cards but retained a typographic index, split hero, and hairline-driven content structure. It did not carry the reference sites' centered launch story, visible interface demo, or utility-led project navigation far enough. This revision restructures page composition and browsing behavior.

## Work plan

- [x] Refresh reference findings and replace the old visual direction in the design brief.
- [x] Rebuild the homepage into a centered product promise, real interface stage, proof strip, and selectable project story.
- [x] Replace the duplicate project list/tab viewer with one keyboard-operable project selector and screen-led case study.
- [x] Rework shared section headers and navigation; update About, Experience, Contact, and route-directory surfaces.
- [x] Review home, work, about, experience, and contact at desktop and 390px mobile sizes; inspect project selection, contrast, and overflow.
- [x] Run production build, lint, and both TypeScript checks; resolve implementation regressions.
- [x] Update the craft/specialist reviews and prepare the follow-up for the existing unmerged PR.

## Preserve list

All routes remain wired through `src/App.tsx`; project facts and actual screens remain in `src/content/portfolio.ts`; contact form behavior, résumé and blog lazy loading, analytics, skip link, keyboard focus, theme toggle, and reduced motion are preserved. MINT Game Hub has no project screenshots, so its showcase uses a labeled typographic game index instead of a fabricated product screenshot.
