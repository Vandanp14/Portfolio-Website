# Design Brief — VandanPatel.me, "Specimen"

**Status:** decided. This brief is the only artifact the build needs. It supersedes `docs/PORTFOLIO_REVAMP_SPEC.md` and the current band palette.

**Decision source:** `docs/research/ai-bigtech-recon.md` (30 live pages) + `docs/research/current-brand-audit.md` (current tokens, ranked palettes, differentiation map). The chosen palette is **Candidate A — Bone / Ink / Cobalt**; the chosen type system is **rank #1 — Instrument Serif / IBM Plex Sans / IBM Plex Mono**.

---

## 1. Intent

Present one systems engineer the way a great product company presents a product: **staged, measured, warm to read and unmistakably technical.** The site should feel *made* — like a printed specimen catalogue of real engineering work — not generated.

Visitors, in order:

1. **Hiring manager (60 seconds).** "Who is this, what do they do, and is the work real?" → hero claim, availability, three proof acts with numbers.
2. **Engineer (3 minutes).** "What did they actually build?" → project acts with spec sheets, screenshots, architecture notes.
3. **Recruiter (30 seconds).** "How do I reach them, and can I get the résumé?" → persistent contact link, résumé in the nav, footer availability.
4. **Peer (optional).** "What else are they into?" → writing index, about page.

**Non-goal:** being a design demo. Every expressive move must make the work easier to believe.

---

## 2. Design thesis

> **A warm paper specimen catalogue with one cold signal colour, staged like an Apple product page and set like an engineering journal.**

Three rules follow from it:

- **Paper for reading, runtime for proof.** The page is bone paper; the Fanatics/AI section and the footer invert to near-black. One inversion, deliberate.
- **Serif speaks, mono measures, sans explains.** No paragraph in mono, no metric in serif, no headline in sans.
- **Square everything that reads; round only the one action.** Radius 0 on sections, media, rules and cards. Radius 999px exclusively on the primary CTA.

---

## 3. Token architecture

### 3.1 Colour (semantic roles, not raw hex in components)

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F4F1E8` | Default page ground |
| `--paper-2` | `#EAE6DA` | Recessed band, table stripes |
| `--paper-3` | `#DED9CA` | Media mat, hover wash |
| `--ink` | `#12110E` | Headlines, body |
| `--ink-2` | `#4A4740` | Secondary body, captions |
| `--ink-3` | `#6E6A60` | Metadata only (17px+ or ≥600 weight) |
| `--rule` | `rgba(18,17,14,.14)` | Hairlines |
| `--rule-strong` | `rgba(18,17,14,.30)` | Table rules, focus |
| `--accent` | `#2440FF` | Links, active states, one CTA |
| `--accent-press` | `#1630E0` | Pressed/hover |
| `--accent-soft` | `rgba(36,64,255,.07)` | Selection, row highlight |
| `--runtime` | `#0C0C0B` | Dark band ground |
| `--runtime-2` | `#17160F` | Raised surface inside dark band |
| `--chalk` | `#EFEBE0` | Text on runtime |
| `--chalk-2` | `#B8B3A6` | Secondary text on runtime |
| `--chalk-3` | `#8C877B` | Metadata on runtime |
| `--accent-dark` | `#7C8CFF` | Accent on runtime |

**Measured contrast** (computed, not assumed):

```
ink/paper            16.72   chalk/runtime         16.43
ink-2/paper           8.20   chalk-2/runtime        9.35
ink-3/paper           4.78   chalk-3/runtime        5.47
accent/paper          5.72   accent-dark/runtime    6.57
ink/paper-2          15.13   accent/runtime         3.03  ← never text
ink-3/paper-2         4.32  ← FAILS AA; use ink-2 on paper-2
```

The only gradient in the system: `--spectrum: linear-gradient(96deg, #2440FF 0%, #7A4DFF 52%, #FF6A3D 100%)`. Permitted in exactly two places — a 2px hero rule and the footer wordmark underline. Nowhere else.

### 3.2 Type

Loaded from Google Fonts (`Instrument Serif` 400 + italic, `IBM Plex Sans` 400/500/600, `IBM Plex Mono` 400/500), `display=swap`. CSP already permits `fonts.googleapis.com` / `fonts.gstatic.com`.

| Role | Family | Size | Line-height | Tracking |
|---|---|---|---|---|
| `display` | Instrument Serif 400 | `clamp(3.25rem, 8.2vw, 6.5rem)` | 0.94 | -0.02em |
| `display-sm` | Instrument Serif 400 | `clamp(2.5rem, 5vw, 4rem)` | 0.98 | -0.015em |
| `h2` | Instrument Serif 400 | `clamp(2rem, 3.6vw, 3rem)` | 1.02 | -0.01em |
| `h3` | IBM Plex Sans 500 | 1.3125rem (21px) | 1.25 | -0.01em |
| `body` | IBM Plex Sans 400 | 1.0625rem (17px) | 1.62 | 0 |
| `body-lg` | IBM Plex Sans 400 | 1.3125rem (21px) | 1.55 | -0.005em |
| `small` | IBM Plex Sans 400 | 0.9375rem (15px) | 1.55 | 0 |
| `mono` | IBM Plex Mono 400 | 0.8125rem (13px) | 1.5 | +0.01em |
| `eyebrow` | IBM Plex Mono 500 | 0.6875rem (11px) | 1.4 | +0.14em, uppercase |

Numerals: `font-variant-numeric: tabular-nums` on every metric, date, index and price.

### 3.3 Space, grid, geometry

- Space scale (4px base): `4 8 12 16 24 32 48 64 96 128 160 208`.
- Page gutter: `clamp(20px, 5vw, 72px)`. Max content: `1320px`. Text measure: `62ch` (body), `44ch` (intro).
- Section rhythm: `clamp(96px, 12vw, 176px)` vertical padding; acts separated by a hairline, never a shadow.
- Radii: `0` for every reading surface, media, table and rule; `2px` for tags/inputs; `999px` for the single primary CTA and the availability dot.
- Borders: 1px `--rule`; hover/active 1px `--rule-strong` or `--accent`.
- Shadows: **none**, except one soft ink shadow on the fixed top bar when scrolled (`0 12px 32px -24px rgba(18,17,14,.45)`).

### 3.4 Motion

| Token | Value |
|---|---|
| `--ease` | `cubic-bezier(.22,1,.36,1)` |
| `--ease-in-out` | `cubic-bezier(.65,0,.35,1)` |
| `--t-fast` | `120ms` (colour, underline) |
| `--t-ui` | `180ms` (buttons, menu) |
| `--t-reveal` | `700ms` (masked line rise) |
| `--stagger` | `55ms` |

Rules: one reveal per element, once; masked word-rise for display lines; 12px fade-up for blocks; no parallax, no looping, no background motion. `prefers-reduced-motion` disables transforms and reveals entirely, leaving opacity 1.

### 3.5 Band architecture (keep the good idea, change the values)

Two bands only, both re-declaring the same variable names so components never hardcode colour:

- `.band-paper` → `--bg: var(--paper)`, `--fg: var(--ink)`, `--muted: var(--ink-2)`, `--meta: var(--ink-3)`, `--line: var(--rule)`, `--link: var(--accent)`.
- `.band-runtime` → `--bg: var(--runtime)`, `--fg: var(--chalk)`, `--muted: var(--chalk-2)`, `--meta: var(--chalk-3)`, `--line: rgba(239,235,224,.16)`, `--link: var(--accent-dark)`.

---

## 4. Information architecture

| Route | Purpose | Composition |
|---|---|---|
| `/` | The argument, in nine acts | Hero → work acts (3) → runtime proof → experience ledger → capabilities → writing → contact/footer |
| `/work` | The catalogue, with depth | Intro → three full case studies (hero, spec sheet, scenes, build notes, outcome) → ten compact builds as a numbered table |
| `/experience` | The ledger | Role rows with dates, scope, highlights, stack → education |
| `/about` | The person | Short bio → toolkit grid → recognition/leadership → interests |
| `/blog`, `/blog/:id` | Writing | Index as a dated list; post as a 62ch reading column with mono metadata |
| `/resume` | The PDF, in-app | Shell matched to the new system |
| `/contact` | Direct contact | One column, email in serif, no form |
| `*` | 404 | One line, one link home |

No new dynamic routes: project depth lives inside `/work` (anchors `#mfp-coach` etc.). The `vercel.json` rewrites and `api/page.ts` section metadata stay valid.

### Home composition (in order)

1. **Top bar (64px, fixed, paper, hairline on scroll).** Wordmark left (new mark), four links, `Résumé ↗`, availability dot + "Open to Summer 2027" on desktop.
2. **Hero.** Mono status line → serif display claim (max 3 lines, 96px) → 21px intro (44ch) → one pill CTA + one text link → hairline meta row: *Location · Focus · Graduating*. Right column (desktop): a "specimen card" — a bordered 3:4 block with the Fanatics photo or a project screenshot, captioned in mono.
3. **`01 — Selected work`.** Three full-width acts. Each: mono index + category, serif claim (the outcome, not the app name), one 17px paragraph, three tabular metrics, one CTA (`Read the case →`), and one large screenshot on a `--paper-3` mat with a mono caption. No card borders around the whole act.
4. **`02 — Proof` (runtime band).** Fanatics: eyebrow, 56px serif statement, the 82K/37ms/36.5% figures at 72px mono, the event photo bleeding to one edge, and a 3-step system diagram drawn in hairline rules and mono labels (Slack → router → AgentCore → Phoenix).
5. **`03 — Experience`.** Ledger table: company, role, period (mono), one-line scope, stack. Current role row gets the accent dot.
6. **`04 — Capabilities`.** Three columns (Backend & distributed / Product & front end / AI & data) with a mono list and one claim each.
7. **`05 — Writing`.** Latest three posts as a dated list, not cards.
8. **`06 — Contact` (runtime).** Availability line, email at 40–56px serif, three plain links, footer wordmark with the one spectrum rule.

---

## 5. Component inventory (new, under `src/components/specimen/`)

`TopBar`, `Availability`, `Hero`, `SpecimenCard`, `SectionHead`, `WorkAct`, `MetricRow`, `ProofBand`, `SystemDiagram`, `Ledger`, `CapabilityGrid`, `WritingList`, `ContactBlock`, `SiteFooter`, `CaseStudy`, `SpecSheet` (definition-list of stack/role/year/links), `ScreenshotFrame`, `MonoLabel`, `PillButton`, `TextLink`, `Reveal`.

Shared primitives to keep from the old code (not visual): `SplitLines` idea (reimplemented as masked line rise), `reveal.ts` observer (rewritten for the new classes), `router.ts`, `seo.ts`, `analytics.ts`, `theme.ts`, `prefetch.ts`, content data.

---

## 6. Copy voice

**Rules**

1. Declarative, first person, no adjectives that a competitor could also claim.
2. Every claim carries a number, a named system, or a date.
3. No "passionate", "innovative", "seamless", "cutting-edge", "leverage", "journey", "ecosystem".
4. Bold-verifiable, not hype: "Product Builder had no API. I built it." not "Pioneered API excellence."
5. Captions explain the screen; they do not repeat the heading.

**Before / after**

| Old | New |
|---|---|
| "I build the systems other people build on." | "Product Builder had no API. I built its first one — and the agent that queries 82,000 records in 37 ms." |
| "A fitness analytics PWA that replaced a $100/year subscription stack." | "One dashboard, 44 routes, zero subscriptions. Every metric computed before a model ever sees it." |
| "Projects move ahead of the experience timeline because proof of work is the most persuasive content." | "Three products, shipped end to end. The rest is on the record." |

---

## 7. Do-not-regress list

Carried from the audit; every later change must preserve these.

1. Specific, verifiable writing (numbers, endpoint counts, test counts).
2. Band-variable architecture — one component, two grounds.
3. AA contrast on both grounds, documented in `src/index.css`.
4. Short hovers (≤180ms) and non-looping motion.
5. Complete information: work, experience, education, toolkit, writing, résumé, contact.
6. Keyboard focus visible on every interactive element (2px accent outline, 3px offset).
7. Reduced-motion support.
8. `api/page.ts` per-route metadata continues to match the visible page.

---

## 8. What we are NOT doing

- Not building a second dark theme. Light paper is the product; the runtime band is a section.
- Not adding project detail routes (keeps `vercel.json` and `api/page.ts` intact).
- Not adding a contact form, calendar, chatbot, cursor effect, grain overlay, progress bar, or scroll-jacking.
- Not using photography we do not have; screenshots are staged as specimens on paper mats.
- Not imitating Cluely's provocation, Linear's glow plinth, Stripe's full spectrum, or Apple's retail chrome.
- Not keeping any of: violet accent, pure-white paper, Geist, 3-up card grids, band-mist, shadows on cards, stacked rounded panels.
- Not adding a CMS, animation library, or new runtime dependency.

---

## 9. Phased plan

### P1 — Foundation and shell **(M)**

- Rewrite `src/index.css` as the token system + base + type roles + band classes + reveal engine + focus/selection rules.
- Load the three fonts in `index.html`; update `boot.js` theme colours.
- Rebuild `TopBar`, `SiteFooter`, `PillButton`, `TextLink`, `MonoLabel`, `SectionHead`, reveal primitives.
- New 404.
- **Exit:** any page renders with correct type, palette, contrast and focus states.

### P2 — Home and work **(L)**

- Hero + specimen card + meta row.
- Three work acts + metrics + screenshot frames.
- Runtime proof band with system diagram.
- Experience ledger, capabilities, writing list, contact block.
- `/work` case studies + compact builds table.
- **Exit:** home and `/work` complete, responsive at 360/768/1280/1600, reduced-motion verified.

### P3 — Remaining routes and polish **(M)**

- `/experience`, `/about`, `/contact`, `/blog`, `/blog/:id`, `/resume`, project anchors.
- SEO/meta/JSON-LD alignment, OG image copy, `sitemap`/`rss` untouched.
- Lighthouse pass: LCP < 2.0s, CLS 0, contrast clean, no layout shift from fonts.
- **Exit:** `npm run lint`, `tsc`, and `npm run build` pass; production preview reviewed.

**Sequencing:** P1 → P2 → P3. No route is restyled before the token system exists. No new component may introduce a hex value — every colour is a token.

---

## 10. Acceptance checks

- [ ] Zero `#` hex literals in components; all colour via tokens.
- [ ] Every page uses exactly one serif voice, one sans, one mono.
- [ ] Radii limited to 0 / 2px / 999px.
- [ ] Only two gradient uses exist in the codebase.
- [ ] No card shadows; hairlines and whitespace carry structure.
- [ ] Contrast table in `src/index.css` matches computed ratios.
- [ ] Keyboard-only pass through home, work, blog, contact.
- [ ] `prefers-reduced-motion: reduce` shows all content immediately.
- [ ] 360px viewport has no horizontal scroll.
- [ ] Old site is fully gone: no `band-mist`, no violet, no Geist, no 3-up grid.
