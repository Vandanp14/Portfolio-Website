# Craft audit — portfolio editorial refresh

Review date: 2026-10-18 · Scope: homepage and shared navigation, case-study viewer, experience timeline, toolkit, route directory, desktop and narrow mobile widths.

## Ranked findings

1. **S3 — Homepage introduction was long on small screens.** Reduced it to two factual sentences; project details retain the full work story.
2. **S3 — The opening needed an early proof point.** Added a real responsive MFP Coach screen beside the opening statement, then moved screenshots to the lead position in each case study.
3. **S3 — The palette did not distinguish the portfolio.** Replaced violet with warm paper and a contrast-checked vermilion accent; kept dark project surfaces readable.
4. **S3 — Work and route discovery relied on text-heavy lists.** Added project selection pills and a responsive route directory with clear hover, focus, and selected states.
5. **S3 — Experience and toolkit content needed stronger scan paths.** Added a timeline rail with a current-role marker and replaced the scrolling toolkit marquee with grouped, interactive skill rows.

## Preserve

- Real screenshots and case-study data, clear route model, keyboard-accessible navigation and project selection, résumé/contact behavior, and reduced-motion handling.
- Semantic links, visible focus, useful touch targets, and the existing theme control.

## Evidence

- Chrome DevTools visual review at desktop and narrow mobile widths across home, work, about, experience, and contact. The case-study selector updated both active state and screenshots; the experience timeline and toolkit render without horizontal overflow.
- Contrast calculation: secondary ink/paper 6.49:1; quiet ink/paper 4.85:1; accent/paper 5.24:1; secondary ink/dark slate 8.75:1.
- `npm run lint`, both TypeScript project checks, and `npm run build` passed during the implementation pass. The build reports existing stale `caniuse-lite` data and a large PDF worker chunk.

## Sources

Design references and citations are recorded in `docs/research/portfolio-reference-patterns.md`.
