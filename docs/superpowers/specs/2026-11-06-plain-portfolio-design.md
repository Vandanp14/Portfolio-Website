# Plain portfolio: design

## Intent

The site reads like marketing: a slogan, stat tiles, a KPI banner, display type and scroll effects. Vandan wants it to read like an engineer's personal site, in the direction of krushil.com and affaanmustafa.com, and to include the projects built since the last update, with real screenshots.

## Goals

- A short home page, a scannable project list, and a detail page per main project with screenshots.
- Add Oswego Dining, Evenly (`~/Documents/Projects/splitwise`), ATS Resume Tailor, HigherEdJobs Review and RA Tools. Rewrite Centro from the current résumé.
- Real screenshots of deployed apps committed through `vite-imagetools`.
- Work on a new branch with a Vercel preview. Existing branches and styles stay intact.

## Non-goals and anti-goals

- Not a clone. Never reuse either reference site's copy, names, palette pairings, photos or assets.
- No slogan, stat tiles, metric chips, gradients, scroll reveals, scramble, marquee or device frames.
- No merge to `main` and no production deploy without Vandan's approval.
- No new dependencies.

## Approaches

1. **Krushil skeleton with screenshot proof (chosen).** List rows on `/work`, screenshots on detail pages. It scales to 18 projects and keeps the home page small.
2. Affaan-style stacked project cards with media. Stays visual, but 18 cards make a very long page.
3. Strict Krushil, no images. Cleanest, but throws away real screenshots, which were explicitly requested.

Chosen by Claude from the teardown because Vandan delegated planning. He may still pick differently on the preview.

## Base branch

`feat/plain-portfolio` from `origin/main`, per the repo's shipping rule. `opencode-changes` (open PR #8) is untouched and not included.

## Preserving styles

- `main` style: archive branch `design/sections` at the current `origin/main` commit, pushed before any merge.
- `opencode-changes`, `feat/portfolio-editorial-refresh`, `design/onepage`, `design/classic`: untouched.

## Truthfulness rules

- `~/Desktop/ATS_Resume_Tailor_Agent/master.json` is the canonical résumé. Numbers must appear in it or in the project's repo docs.
- Drop the "four-person Agile team I led" Centro claim: the current résumé no longer makes it.
- Drop all claims a one-sentence row does not need. No "390+ tests" total.
- No MFP Coach live link: commit `d743cf7` removed it deliberately.
- Private repos get no repo link: ATS, Oswego Dining, Evenly, RA Tools, Transit Ledger.
- Excluded on purpose: Laker Connection (student data), Homelab and playlist projects (private library), team and generated repos, dead ends.

## Voice

Vandan's instruction: the wording must sound like a CS student with real experience, not AI slop.

- First person, plain and specific. Say what it does and what I did, as I'd explain it to another student or an interviewer.
- Keep real technical detail and résumé numbers. Don't inflate them.
- Banned words and patterns: architected, spearheaded, leveraged, robust, seamless, cutting-edge, end-to-end, production-grade, enterprise, passionate, delve, elevate, empower, unlock, showcase, "guaranteed", "not X but Y" contrasts, rule-of-three flourishes, and punchline fragments.
- No em dashes in prose, no invented motives or stories, and no slogans.

## Screenshots

| Project | Source | Use |
|---|---|---|
| Oswego Dining | Fresh capture | Menu, Picks, item detail, mobile menu, mobile item. Not Chef: it shows a visible bug. |
| Centro | Fresh capture | Live map, route arrivals, home, mobile arrivals. |
| Evenly | `docs/screenshots` in its repo, sample data | Group, insights, overview, phone add expense. |
| MINT Game Hub | Fresh capture | Had none. |
| ATS, HigherEdJobs, RA Tools | None | ATS shots name a real employer and show the résumé. The others need local runs with personal or resident data. |

## Visual system

- Geist only. Body 16px/1.65. Name 40px weight 500, tracking -0.02em. Page title 28px weight 500. Section heading 18px weight 500. Meta 14px. Nothing smaller than 13px.
- Light tokens: `--bg #FCFCFA`, `--text #1A1A19`, `--text-2 #62625E`, `--text-3 #73736E`, `--line #E4E4DF`, `--line-strong #B8B8B2`.
- Dark tokens: `--bg #111110`, `--text #EDEDEA`, `--text-2 #A3A39E`, `--text-3 #85857E`, `--line #2A2A28`, `--line-strong #4A4A46`. Toggle stays.
- Reading column 640px, screenshots break out to 960px, gutter 20px. No accent colour.
- Hairlines, no shadows. Screenshots get a 1px border and 6px radius; no device frames.
- Motion: colour transitions 150ms and a 150ms page fade only. Reduced motion: none.
- Static top bar: name left, links right, wrapping on phones. No overlay menu.

## Routes

`/`, `/work`, `/work/:id` (new), `/experience`, `/about`, `/blog`, `/blog/:id`, `/resume`, `/contact`. Unknown project id renders `NotFound` and the server answers 404 with noindex.

## Left to the builder

Component structure and Tailwind versus CSS, within the plan's interfaces and tokens.
