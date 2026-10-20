# Craft audit — specimen rebuild

Date: 20 Oct 2026 · Branch: `opencode-changes` · Build: Vite production bundle
Scope: `/`, `/work`, `/experience`, `/about`, `/blog`, `/blog/:id`, `/resume`, `/contact`, 404

This is the verification pass required by `DESIGN_PLAN.md` Phase 5. It records what
was measured, what failed, and what was changed — not intentions.

## Method

| Check | Tool / method |
| --- | --- |
| Horizontal overflow | Headless Chrome, 7 routes × 5 widths (360, 390, 768, 1024, 1440), `scrollWidth` vs `clientWidth`, per-element rects |
| Contrast | Computed `color` and effective ancestor background for every text node, WCAG 2.1 formula, large-text rule applied |
| Structure | One `<h1>` per route, every `<img>` has `alt` |
| Keyboard | Tab sequence on desktop; menu open/close/trap on mobile; computed focus outline |
| Reduced motion | `prefers-reduced-motion: reduce` emulation, opacity of reveal nodes and running animations |
| Deep links | `/work#mint-game-hub` measured against the 64 px sticky header |
| Blog rendering | `/api/blog` mocked with index + post payloads, including a `<script>` payload |
| Build | `tsc --noEmit`, ESLint, `vite build`, chunk sizes |

## Results

### Layout
- **PASS** — no horizontal scroll at any of the 35 route/width combinations.
- **PASS** — one `h1` per route; all images have `alt`.
- Fixed during the audit:
  - `grid-column: span N` + `grid-column-start` collapsed positioned items to a
    single track (`span` is replaced, `end` stays `auto`). Position pairs are now
    explicit shorthands (`9 / span 4`), with the mobile reset declared at the same
    specificity.
  - Catalogue year cell was auto-placed into the number column on mobile; rows now
    use explicit `grid-row` placement.
  - Section rule + list rule produced a double hairline 40 px apart on the ledger
    and catalogue; the list top rule was removed.
  - `.notes` used a 44 px date column for "Jan 2024 — Present"; dated lists now use
    132 px (stacked below 600 px).
  - "Expected Expected December 2026" duplicate on `/experience`.

### Contrast
All small text now passes 4.5:1 on its own band. Measured ratios:

| Pair | Ratio |
| --- | --- |
| ink / paper | 16.72 |
| ink-2 / paper | 8.20 |
| ink-3 / paper | 4.78 |
| accent / paper | 5.72 |
| chalk / runtime | 16.43 |
| chalk-2 / runtime | 9.35 |
| chalk-3 / runtime | 5.47 |
| accent-dark / runtime | 6.57 |

Banned pairs (never used): `ink-3` on `paper-2` (4.32) and `accent` on `runtime`
(3.03). The typographic plate sits on `paper-3`, so its small type uses `ink-2`
rather than the page-level `meta` token.

### Interaction and accessibility
- **PASS** — skip link is first in the tab order and targets `#content`.
- **PASS** — 2 px accent focus ring on every interactive element tested.
- **PASS** — mobile menu: opens with focus on the first link, locks background
  scroll, traps Tab at both ends, closes on Escape and returns focus to the
  trigger; a route change also dismisses it.
- **PASS** — reduced motion: no reveal node stays hidden, no animation runs longer
  than 0.2 s.
- **PASS** — deep links land ~72 px below the top of the viewport, clear of the
  64 px sticky bar.
- **PASS** — blog HTML is sanitised; a `<script>` in the payload produced zero
  script nodes in the rendered prose.

### Typography and rhythm
- Display / body / mono split is consistent: Instrument Serif for claims and case
  titles, IBM Plex Sans for reading, IBM Plex Mono for metadata and numerals.
- Section rhythm tightened from `clamp(88, 11vw, 168)` to `clamp(64, 7vw, 112)`
  after the double-band gaps measured 280–340 px; adjacent bands now hand off at
  ~200 px.
- Page intros, post bodies, contact band and footer were tightened individually so
  the runtime band reads as a destination rather than a new chapter.
- Radius rule holds: 0 on reading surfaces, 2 px on tags/inputs, 999 px only on the
  primary pill.

### Performance
- Production build: main JS 208 kB minified, résumé route 551 kB (pdf.js, lazy),
  PDF worker 1.3 MB (only fetched on `/resume`).
- Screenshots ship as WebP with JPEG fallback through `<picture>`; the largest
  hero-adjacent asset is 104 kB WebP.
- Fonts: `display=swap`, two preconnects, three families with only the weights used.

## Round 2 — real-runtime audit

Run after the first pass, against a `vercel dev` server with the live Apps Script
blog, the live résumé PDF and the OG function (not mocks).

| Check | Tool / method | Result |
| --- | --- | --- |
| Automated a11y | axe-core 4.10.2, WCAG 2.0/2.1/2.2 A–AA + best-practice, `/`, `/work`, `/experience`, `/about`, `/blog`, `/blog/:id`, `/resume`, `/contact`, 1440 + 390 | **0 violations** |
| Real blog index | 2 live posts, dates and 4-min read times rendered | **PASS** |
| Real blog post | live HTML, 7 links, sanitised, `h1 → h2` outline | **PASS** |
| Real résumé | live 1-page PDF, 38 KB, toolbar `01 / 01`, fit 150 % / 57 % | **PASS** |
| OG card | home + post card rendered through `/api/og` and inspected | **PASS** after fix |
| Route meta | `/blog`, `/work`, `/experience`, `/about`, `/contact`, `/resume` titled and described server-side | **PASS** |
| RSS | channel title `Writing — Vandan Patel`, curated description | **PASS** |

Fixed during this pass:

- **Dates were a day early.** `new Date('2026-08-14')` parses at UTC midnight, so
  every date-only value rendered as the previous day in the Americas. Blog and
  résumé dates now go through `src/lib/dates.ts`, which builds date-only values
  from their components at local noon.
- **`<aside>` inside `<main>`** on `/work` (axe: complementary landmark not
  top-level) → plain `div`; the spec sheet keeps its styling.
- **`<dl>` with bare `<div>` children** on `/resume` → a plain metadata stack.
- **Invisible smart-chip links.** Google Docs emits an empty twin anchor beside
  every URL; they were focusable but nameless. Empty anchors are now removed
  after sanitising, and post headings are normalised so the page has one `h1`
  followed by `h2` sections regardless of the source document.
- **Long URLs overflowed the post at 390 px.** Prose links now use
  `overflow-wrap: anywhere`; paragraphs and list items use `break-word`.
- **OG card titles rendered with plus signs** (spaces encoded by
  `URLSearchParams` as `+`). `ogImageUrl` now emits `%20`, a form every proxy
  decodes identically; cache version bumped to `v=3`.
- **Blog meta drifted from the site.** The document title used the Apps Script
  index title (“My Daily Blog”) and its generic description. `/blog` now always
  uses `Writing — Vandan Patel` and the curated description on the page, in the
  HTML shell and in RSS. The contact description in `api/_lib/site.ts` was also
  aligned with `src/lib/routes.ts`.
- **Loading rows said “Loading” three times.** Replaced with a hash-mark date bar
  and a pulsing title bar, `aria-busy`, and visually hidden status text; motion is
  disabled under reduced motion.
- **`vercel dev` route meta 503.** `VERCEL_URL` is `localhost:3001` without a
  scheme there, so the shell fetch used `https://localhost`; local request hosts
  are now honoured before `VERCEL_URL`.
- **`/blog` shell waited on Apps Script.** The route's title, description, OG
  tags and `Blog` JSON-LD are now static, so a cold link preview never blocks on
  the blog service. Post pages still fetch their own post; `BlogPosting` data
  lives there, and the RSS/sitemap still enumerate the index.

## Known limits

- `/api/blog`, `/api/resume` and `/api/og` do not run under `vite preview`. Their
  loading and error states were verified in the production bundle; the happy
  paths were verified once with mocks and again against a real `vercel dev`
  runtime with the live Apps Script sources (see Round 2).
- Screen-reader behaviour was not tested with VoiceOver/NVDA hardware; the
  semantics (landmarks, skip link, dialog roles, live-less error alerts) were
  verified in the accessibility tree.
- Real-device Safari/iOS was not available; layout was checked in Chrome at the
  five widths above.
