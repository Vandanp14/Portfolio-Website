# Craft audit — systems atlas

Review date: 2026-10-18 · Scope: main route compositions, navigation, real project media, and responsive presentation.

## Result

This revision discards the last version's centered project showcase and selector. Home is offset and route-marked, Work is three full-bleed product chapters with supporting technical notes, Experience is chronological, About is a skills/foundations map, and Contact is a separate dark channel. Typography, color, and page structure all changed as one system.

## Visual and interaction review

- Local browser review covered Home, Work, About, Experience, and Contact. All five main routes were checked at a 390px mobile viewport; each document measured 390px wide, with no horizontal overflow. Work and Contact were visually captured at mobile size.
- Work uses the real supplied responsive screenshots. The screenshot controls are actual buttons with pressed state; image changes receive a short opacity/translate transition. MINT uses a labeled type composition because its data contains no screenshots.
- Navigation preserves all primary routes, Writing, résumé, theme control, and active-page indication. Contact retains email, GitHub, LinkedIn, validation, and `sendContact` delivery behavior.
- Page entrance and project-image changes honor `prefers-reduced-motion`; CSS uses transform/opacity for entrance motion.
- Remaining review: keyboard interaction pass and numeric contrast sampling on the new warm palette.

## Verification

- `npm run lint` — pass.
- `npm run build` — pass. Existing warnings: outdated Browserslist data and the résumé PDF worker chunk exceeding the bundle size advisory.

## Reference translation

Apple's full-bleed product chapter storytelling, Cluely's visible real product surface and ordered evidence, and Uber's direct navigation/progression informed patterns only. The pages use portfolio-specific copy, images, route marks, and compositions. References: [Apple](https://www.apple.com/), [Cluely](https://cluely.com/), [Uber](https://www.uber.com/).
