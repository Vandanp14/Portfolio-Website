# Craft audit — product-story revamp

Review date: 2026-10-18 · Scope: all primary routes, project selection, case-study display, navigation, desktop and 390px mobile layouts.

## Main finding from the first pass

The first refresh changed colors and added cards but kept the previous typographic index composition. That did not meet the requested full redesign. This follow-up rebuilds the home and work hierarchies and changes shared navigation, section openers, contact, and page surfaces.

## Current review

- Home opens with one centered promise, direct actions, an actual MFP Coach screenshot in a framed interface stage, and verified outcome figures.
- Home's featured-project switcher changes project copy, metrics, image, selected state, and progress indicator. MINT Game Hub has no supplied screenshot, so the display is clearly a typographic list of its five games.
- Work replaces the previous oversized text list plus a second set of tabs with one keyboard-operable project selector beside the active case study.
- About, Experience, Contact, and the route directory use the refreshed type, surfaces, controls, and page spacing.

## Evidence

- Chrome DevTools reviewed the home, work, about, experience, and contact routes at desktop and 390px mobile widths. Checked home project selection, work project presentation, and no horizontal overflow in those views.
- Contrast: action blue `#1764E8` on white 5.22:1 and on cool-white canvas 4.83:1; bright blue `#94B6FF` on near-black 9.74:1; secondary light text `#C0C4CE` on near-black 11.27:1.
- `npm run lint`, both TypeScript project checks, and `npm run build` passed. Build retains the existing Browserslist-data and PDF worker chunk warnings.

## Reference patterns

Apple's centered product launches, Uber's direct navigation and process cues, and Cluely's early inspectable product surface are documented in `docs/research/portfolio-reference-patterns.md` and applied to original portfolio content.
