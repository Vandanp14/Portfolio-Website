# Design brief — systems atlas

## Intent

Replace the inherited portfolio layout entirely with a recognizable visual system and new page compositions. Visitors should understand Vandan's engineering focus, inspect real project evidence, and reach the résumé or contact channel without navigating a resume-shaped list of cards.

## Audience and primary task

Engineering recruiters, hiring managers, and collaborators. Primary task: inspect the shipped work and how it was built. Secondary tasks: follow the work history, understand technical range, and contact Vandan.

## Reference patterns

- **Apple** — a concise story opens a page, full-bleed visual evidence carries the story, and each chapter has a distinct rhythm. Translate this as real screenshots and scene-based case studies; do not reproduce a product launch template.
- **Cluely** — make the actual product surface inspectable early and explain how it works in ordered steps. Translate this as project imagery, implementation details, and selectable real screenshots; do not fabricate interfaces.
- **Uber** — clear route choices, visible sequence, and direct next actions. Translate this as numbered chapter paths and the career timeline; do not copy Uber's navigation or branding.

Sources: [Apple](https://www.apple.com/), [Cluely](https://cluely.com/), [Uber](https://www.uber.com/).

## Direction

**Systems atlas.** The previous version reused its centered launch hero, modular showcase, selector, and repeated section framing. This direction discards those compositions. The site uses numbered stops, route-like vertical rules, outsized sans/serif typography, actual interface screenshots, and three separate visual environments: warm paper, near-black project stages, and a signal-red finish. Work reads vertically as three case-study scenes, not as a dashboard, tiled gallery, or tabbed viewer. Experience uses a chronological path. About is an annotated skills map. Contact is a dark, direct channel.

### Token architecture

- Warm paper `#eeece4`; secondary paper `#e2dfd4`; ink `#171915`.
- Signal red `#b93d29` for active route markers, chapter emphasis, and the closing field; contrast is 4.72:1 on warm paper. In dark theme, a lighter red `#f17159` is used against dark text surfaces (6.11:1).
- Acid lime `#d8e54e` is reserved for project-stage route markers and the education chapter.
- Project scene surfaces `#181a16` and `#252720`; readable warm-white copy.
- Geist for oversized sans display and body; Georgia for selected italic display words only; Geist Mono for compact chapter metadata.
- Primarily flow and flex composition. No repeated card grid. Media is edge-to-edge and uses verified source screenshots.
- Motion: quick named-token hover feedback, a short opacity/translate route entrance, and a subtle screenshot change. No scroll-jacking or ambient animation. Reduced motion removes the entrance and screenshot transition.
- Light/dark theme toggle remains available and updates the full new palette.

## Page structure

1. **Home:** topographic masthead; offset oversized statement with route stem; genuine MFP Coach interface image; proof line; numbered project route; direct links to the rest of the site.
2. **Work:** tall typographic opener; numbered jump navigation; three vertically ordered full-bleed case-study scenes. Each has an actual screenshot carousel of buttons, implementation story, measured outcomes, and stack. MINT gets an explicitly labeled typographic game index because no screenshot exists. Smaller builds appear as a flowing list.
3. **Experience:** title and chronology followed by a single career path, with real role details and dates.
4. **About:** personal statement, skill vocabulary, education, and community/recognition as three distinct chapters.
5. **Contact:** direct links and validated message form on a near-black page.

## Preserve

- Verified data, metrics, screenshots, project links, route behavior, analytics, skip link, résumé and blog lazy loading, theme choice, and message delivery.
- Keyboard-operable screenshot controls, semantic page headings, clear focus styles, and reduced-motion behavior.
- All project claims remain sourced from the existing portfolio data; no fabricated screenshots or metrics.

## What we are not doing

- No reuse of the prior centered hero + selectable showcase, two-column work selector, generic card/grid system, or previous band-by-band section layout.
- No imitation of reference site branding, assets, copy, product chrome, or exact layouts.
- No decorative 3D, gradient backdrop, fabricated product UI, or animation that delays reading.

## Phased plan

- **P1 (L):** replace the main route assembly and create a new atlas shell, home composition, sequential work scenes, experience route, and About chapters.
- **P2 (M):** rebuild Contact around the existing send/validation contract; preserve blog/resume, analytics, theme, and metadata behavior.
- **P3 (M):** inspect desktop/mobile, check keyboard/route interactions and reduced motion, update notes, lint and production build.
