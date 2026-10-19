# Craft audit — portfolio refresh

Review date: 2026-10-18 · Scope: homepage at desktop and narrow mobile widths; shared palette and primary navigation.

## Ranked findings

1. **S3 — Homepage introduction is long on small screens.** Reduced it to two factual sentences; the full work story remains in project details.
2. **S3 — New page needed an early proof point.** Added a real, responsive MFP Coach screen and its concise project context beside the opening statement.
3. **S3 — Prior violet palette did not distinguish the portfolio.** Replaced it with warm paper and a contrast-checked vermilion accent; dark project surfaces remain readable.

## Preserve

- Real screenshot and case-study data, clear global route model, keyboard accessible nav and project selector, résumé/contact functionality, and reduced-motion handling.

## Evidence

- Chrome DevTools visual review at desktop and 390px page width; verified hero content stacks without horizontal overflow and primary actions stay visible.
- Contrast calculation: secondary ink/paper 6.49:1; quiet ink/paper 4.85:1; accent/paper 5.24:1; secondary ink/dark slate 8.75:1.
- `npm run lint`, both TypeScript project checks, and `npm run build` pass.

## Sources

Design references and citations are recorded in `docs/research/portfolio-reference-patterns.md`.
