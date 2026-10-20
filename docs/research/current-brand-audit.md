# Brand Audit — VandanPatel.me (current system) vs. the researched genre

- **Audited:** 20 October 2026, branch `opencode-changes` at `a2cfe7f`.
- **Method:** read every design token in `src/index.css`, the shell in `src/App.tsx`, the wordmark in `src/components/Wordmark.tsx`, and the shipped copy in `src/content/portfolio.ts`. Values below are the actual tokens in the repository.
- **Purpose:** establish exactly what exists today, what is worth keeping, what must not be imitated, and which palette/type candidates are on the table before the brief decides.

---

## 1. Current-system extraction

### Palette (shipped)

| Role | Light | Dark |
|---|---|---|
| Paper | `#ffffff` | `#0f1113` |
| Mist (alternate band) | `#eeeeee` | `#16181b` |
| Card | `#f8f8f8` | `#1a1d21` |
| Ink / Slate | `#1e2124` | — |
| Chalk | `#f4f4f2` | — |
| Accent | `#5b45e0` (violet) | `#9f8fff` |
| Accent pressed | `#4834c4` | `#bdb2ff` |
| Signal | `#d1442f` | `#f0714f` |

Reading: a cool, high-contrast light system with a saturated violet as the only brand hue, plus a red "signal" that appears rarely. Dark mode is the same system with paper and ink swapped.

### Typography (shipped)

- **One family:** Geist, with Geist Mono for indices.
- Body **18px / 1.4**; display tracking **-0.045em** at `line-height .92`; section titles `clamp(34px, 3.6vw, 50px)` at `-0.035em`; eyebrows 11px uppercase at `+.06em`.
- Weights: everything regular (400); hierarchy comes from size and tracking only.

### Geometry & components (shipped)

- Radii `--r-sm: 2px`, `--r-md: 2px`, `--r-lg: 4px`, `--r-xl: 6px` — effectively square.
- A "band" system (`.band-paper`, `.band-mist`, `.band-slate`) that re-declares the same CSS variables per section. This is the best-engineered part of the current site.
- Wordmark: two offset squares (layered systems) + name at 19px — a good mark, no typographic identity around it.
- Motion: 7 durations (100–1400ms), 8 easing curves, plus a `.reveal` engine with fade/lines/clip/wipe variants.

### Tone of voice (shipped)

Factual, metric-forward, unusually specific — e.g. *"Product Builder's first API"*, *"37 ms worst-case"*, *"cent-level remainder allocation"*. This is the site's strongest asset and should survive any redesign.

---

## 2. Assessment

### Best-in-class today — do not regress

1. **Specificity of the writing.** Numbers, endpoints, tables, test counts. No other portfolio at this level has this much verifiable detail.
2. **The band-variable architecture.** One component written once, inheriting colour from its band. Keep the pattern, change the values.
3. **Contrast discipline.** Every band documents its WCAG ratios; light and dark both clear AA for body text.
4. **Motion restraint.** Short hovers, masked line reveals, no looping decoration.
5. **Information completeness.** Work, experience, education, toolkit, writing, résumé, contact all exist and are reachable.

### What actually fails

1. **No identity.** Geist + white + violet is the default stack of every 2025 AI startup. Nothing on the page says *this* engineer rather than *any* engineer.
2. **No staging.** Projects are cards in a grid. Apple and Linear prove that proof-of-work needs a full viewport and one claim per screen; here three achievements compete inside a 3-up layout.
3. **No editorial voice.** Everything is sans, so headline and metadata have the same temperature. Anthropic/Cursor/Perplexity separate claim (serif) from fact (mono); this site does not.
4. **Card saturation.** Nearly every section is a bordered, rounded rectangle with a shadow. That is the "AI-generated dashboard" tell the brief must remove.
5. **Muted accent problem.** Violet on white is both low-differentiation and semantically generic (AI purple). It also sits close to the old `signal` red without either colour earning a role.
6. **Hierarchy flattens on long pages.** With one family, one weight and one colour, a 12-section page reads as a list rather than an argument.

---

## 3. Assets NOT to imitate

| Do not imitate | Why |
|---|---|
| **Cluely's voice** ("You're running out of time to make generational wealth") | Memorable because it is a venture-backed startup talking to investors and students. On a job-seeking engineer's site it reads as unserious. Borrow the declarative confidence, never the provocation. |
| **Apple's photography-led staging** | The portfolio has a handful of real screenshots and one event photo. Apple's pattern needs studio assets; faking it produces empty spectacles. Stage screenshots as *specimens* (bordered, captioned, on a measured grid), not as floating product renders. |
| **Linear's gradient plinth** | The multi-hue glow behind product UI only works if the UI is the hero at full width and high fidelity. Screenshots at 1x would look cheap on that plinth. |
| **Stripe's full spectrum** | A five-colour gradient mesh is Stripe's identity. Using it wholesale is cosplay. Take only the *discipline*: one expressive moment, confined. |
| **Perplexity's product chrome** | PPLX's palette and serif are attractive, but the site is a live product UI; a portfolio has no query box to justify it. |
| **Any dark-first cyber/terminal aesthetic** | The audience is recruiters and hiring managers reading on laptops in daylight. Pure black + neon reads as a game portfolio, not an engineering one. |
| **Cluely/Linear dark-mode-everywhere** | Keep light paper as the default reading environment; dark exists as a *band*, not as the whole product. |

---

## 4. Candidate palettes — ranked

Ranking basis: differentiation from the current violet-on-white, credibility with a technical hiring audience, and the ability to hit AA contrast without muddying the accent.

### Candidate A — Bone / Ink / Cobalt **(recommended)**

| Token | Value | Contrast on paper |
|---|---|---|
| Paper | `#F4F1E8` | — |
| Paper raised | `#EAE6DA` | — |
| Ink | `#12110E` | 17.8:1 |
| Ink secondary | `#4A4740` | 8.9:1 |
| Ink tertiary | `#6E6A60` | 5.4:1 |
| Rule | `rgba(18,17,14,.14)` | — |
| Accent | `#2440FF` | 6.2:1 |
| Accent on dark | `#7C8CFF` | 7.1:1 |
| Runtime (dark band) | `#0C0C0B` | — |
| Chalk on runtime | `#EFEBE0` | 16.5:1 |

Warm paper like Anthropic/Cursor, ink like Apple, one cold electric accent that no reference uses. The temperature contrast (warm ground, cold signal) is the identity.

### Candidate B — Chalk / Graphite / Verdigris

`#F7F7F4` / `#16181A` / `#0F7A5C`. Calm and institutional; excellent contrast. Rejected: reads like a bank or a university research office, and loses the warmth that makes long reading pleasant.

### Candidate C — Carbon / Chalk / Periwinkle

`#0B0C0E` / `#E8E8E3` / `#8FA4FF`. The Linear look. Rejected: derivative on sight, and a dark-first portfolio for a new-grad engineer can read as style over substance.

### Candidate D — Bone / Ink / Ember

`#F4F1E8` / `#12110E` / `#D64B2A`. Warm on warm, very memorable. Rejected: too close to Anthropic's clay `#d97757` and to the current site's signal red `#d1442f`; the accent loses its job of separating itself from the ground.

---

## 5. Type candidates — ranked

| Rank | Display | Text / UI | Mono | Verdict |
|---|---|---|---|---|
| 1 | **Instrument Serif** | **IBM Plex Sans** | **IBM Plex Mono** | High-contrast modern serif for claims + an engineering-heritage sans for reading + its native mono. Free (OFL), on Google Fonts, three voices that never collide. |
| 2 | Newsreader | Inter | JetBrains Mono | Warmer, softer serif; Inter is competent but is the genre default (and too close to Geist). |
| 3 | Fraunces | IBM Plex Sans | IBM Plex Mono | Very expressive, but the wonky optical axis pulls attention away from the work. |
| 4 | EB Garamond | Inter | berkeleyMono | Cluely's exact pairing; rejected as derivative. |

---

## 6. Differentiation map

| Reference | What we take | What we must not become |
|---|---|---|
| **Apple** | One claim per act; 980px pill only for the single primary action; 17px/1.47 body; display tracking `-0.022em` | Photography-led spectacle, retail chrome, `Learn more ›` everywhere |
| **Anthropic** | Warm paper, serif display, zero-radius reading surfaces, one clay-like accent role, `.2s` UI motion | Copying the cream/clay pair, or the research-institute tone |
| **Cluely** | Declarative confidence in the copy; dark stage for a single proof section | Provocation, meme voice, serif-everywhere |
| **Linear** | Numbered sections, hairline rules, one lit surface, product-as-hero | Dark-first, gradient plinth, glow behind screenshots |
| **Cursor** | Small mono metadata, 2px radius on objects, serif used as emphasis | Tiny-type-everywhere, custom grotesk cosplay |
| **Stripe** | One gradient, confined; tinted shadows; tight display tracking | Five-colour mesh as identity |
| **Vercel** | Aggressive display compression, mono as UI label | Pure black/white minimalism with no warmth |
| **Perplexity** | Serif-for-reading / sans-for-controls split | Product chrome without a product |

**Net position:** warm, measured, technical, one cold signal colour, staged like a product and set like a journal. Closest neighbour is Anthropic; the distinguishing moves are the cobalt accent, the mono spec language, and Apple-grade full-viewport project acts.
