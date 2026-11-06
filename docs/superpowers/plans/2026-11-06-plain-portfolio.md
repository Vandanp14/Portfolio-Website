# Plain Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the portfolio into a plain, list-first personal site and add new projects with real screenshots.

**Architecture:** Keep the Vite + React SPA, History API router, content file and `api/` functions. Replace the band and motion system with one neutral token set, add a `/work/:id` route on client and server, and delete what the new design no longer uses.

**Tech Stack:** Vite 5, React 18, TypeScript, Tailwind 3, vite-imagetools, Vercel Functions. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-06-plain-portfolio-design.md`

## Global Constraints

- All work in the worktree `/Users/vandanpatel/Documents/Projects/portfolio-plain`, branch `feat/plain-portfolio`. Never touch `/Users/vandanpatel/Documents/Projects/portfolio bolt`.
- Run `npm ci` once if `node_modules` is missing. Do not change `package.json` or commit lockfile changes.
- The repo has no test runner, and adding one is out of scope. Each task's test is: `npm run lint`, `npx tsc -p tsconfig.app.json --noEmit`, `npm run build`, plus the task's listed checks.
- Copy in this plan is exact. Do not reword it, add numbers, or restore marketing language.
- Voice: all site copy sounds like a CS student with real experience. First person, plain and specific, explained as to another student or an interviewer. Keep real technical detail and résumé numbers.
- Banned in site copy: architected, spearheaded, leveraged, robust, seamless, cutting-edge, end-to-end, production-grade, enterprise, passionate, delve, elevate, empower, unlock, showcase, "guaranteed", "not X but Y" contrasts, rule-of-three flourishes, punchline fragments, em dashes in prose, invented motives or stories, slogans.
- Commit messages end with `Claude-Session: https://claude.ai/code/session_019L5ef7eXm5dYB8QMD8sAck`.
- Do not push.

## Review Focus

- Direct load or refresh of `/work/oswego-dining`: must render the project, with correct server metadata.
- `/work/nope`: must render NotFound, and the server must answer 404 + noindex.
- Screens 320px wide: no horizontal page scroll, including wide screenshots and long stack lists.
- Dark theme: every page stays readable, including blog prose and résumé viewer.
- Screenshots load lazily with useful alt text, and a `/resume` or blog failure state still looks intentional.

---

### Task 1: Project content and images

**Files:**
- Create: `src/assets/projects/dining-*.jpg`, `centro-*.jpg`, `evenly-*.jpg`, `mint-*.jpg`
- Modify: `src/content/portfolio.ts`

**Interfaces:**
- Produces, in `portfolio.ts`: `ProjectShot` unchanged. `Project` gains `liveNote?: string`. `tagline` is the one-sentence row text. `featuredProjects: Project[]` has the 8 entries below in order. `otherProjects: SmallProject[]` has the 10 entries below in order, where `blurb` is the sentence.
- Temporary: keep `index`, `category`, `metrics`, `stats`, `fanaticsHighlight`, `headline`, `disciplines`, `status`, so current components compile. New entries use `metrics: []`, the next `index`, and a short `category`. Task 3 and 4 remove them.

- [ ] **Step 1: Prepare images.** Sources in `/private/tmp/claude-501/-Users-vandanpatel-Documents-Projects-portfolio-bolt/aa569784-2796-477a-ba48-f4d324513383/scratchpad/shots/`. Convert with `sips -s format jpeg -s formatOptions 82 -Z <max> in --out out`; max 1600 for wide, 1000 for phone:
  - `dining/desktop-01-menu.png` → `dining-menu.jpg`; `dining/desktop-03-picks.png` → `dining-picks.jpg`; `dining/desktop-02-item-detail.png` → `dining-label.jpg`; `dining/mobile-01-menu.png` → `dining-phone-menu.jpg`; `dining/mobile-02-item-detail.png` → `dining-phone-item.jpg`
  - `centro/desktop-02-live-map.png` → `centro-map.jpg`; `centro/desktop-03-route-arrivals.png` → `centro-arrivals.jpg`; `centro/desktop-01-arrivals-home.png` → `centro-home.jpg`; `centro/mobile-01-route-arrivals.png` → `centro-phone.jpg`
  - From `~/Documents/Projects/splitwise/docs/screenshots/`: `group.jpg` → `evenly-group.jpg`; `insights.jpg` → `evenly-insights.jpg`; `overview.jpg` → `evenly-overview.jpg`; `phone-add-expense.jpg` → `evenly-phone.jpg`
- [ ] **Step 2: Capture MINT.** Using Playwright MCP tools, open `https://gamehub-eight-topaz.vercel.app/`. Capture the hub and two playable games at 1440x900 without logging in or submitting anything. Save as `mint-hub.jpg`, `mint-game-1.jpg`, `mint-game-2.jpg` the same way, naming games in alt text and captions after what is actually shown. Remove any stray `.playwright-mcp` folder. Open every produced image with Read to confirm it shows content.
- [ ] **Step 3: Update `portfolio.ts`.** Import via `?w=640;1400&format=avif;webp;jpg&as=picture` for wide and `?w=480;758&...` for phone. Change line 2's comment to name `~/Desktop/ATS_Resume_Tailor_Agent/master.json`. Replace the existing arrays' `tagline`/`summary` as given; keep existing `build`, `stack` and `shots` unless stated. Change the `ledger3` caption to `Categorized ledger`.

`featuredProjects`, in this order:

**mfp-coach**, 2026. tagline: `A fitness app that pulls Apple Watch, nutrition and workout data into one place and gives me a plan for the day.` summary: `Apple Watch, MyFitnessPal and Strong exports flow through iOS Shortcuts into a pipeline I host myself. The app scores readiness, adjusts calorie targets, forecasts weight and asks Gemini for a daily read. It can also log meals straight from Oswego Dining.`

**oswego-dining**, 2026, liveUrl `https://oswego-dining.vercel.app`. tagline: `Today's SUNY Oswego dining hall menus, ranked by protein per calorie.` summary: `A scheduled job scrapes SUNY Oswego's NetNutrition site for all 3 dining halls and stores the results in Google Sheets. The app shows each menu by station with nutrition labels and allergens, ranks what's being served, totals a meal and suggests plates using only items on today's menu. It's unofficial and not run by the college.` stack: `JavaScript, Google Apps Script, Google Sheets, Gemini API, Vercel, GitHub Actions`. build:
- `Scraping runs as a durable job queue with a lease lock and checkpoints, so it finishes inside Apps Script's execution limits and picks up where it left off.`
- `A production quota outage led to a 2-day scrape window and a daily fetch budget. The decision is written up in an ADR.`
- `A Vercel function sits in front of Apps Script with a strict input allowlist and stale-while-revalidate caching.`
- `Gemini returns plates against a response schema. Each one is checked against real menu IDs, and nutrition totals are recomputed from stored data rather than taken from the model.`
- `Covered by 187 automated node:test tests when last counted for my résumé.`
shots: wide menu `Menu by station`, wide picks `Items ranked by protein per calorie`, wide label `Nutrition label, allergens and ingredients`, phone menu `Menu on a phone`, phone item `Item details on a phone`. Write specific alt text.

**evenly**, 2026, liveUrl `https://evenly-sage.vercel.app`, liveNote `Sign-in is limited to people I approve. The screenshots use sample data.` tagline: `A shared-expense app I built for a Thanksgiving trip to Utah with friends.` summary: `Groups join through revocable invite links, then split costs equally, by exact amount, by percentage or by weight, per expense or per item. Next.js runs the interface, and Google Apps Script with a private Google Sheet acts as the database.` stack: `Next.js 16, React 19, TypeScript, Google Apps Script, Google Sheets, Vitest, Playwright`. build:
- `Money is stored as integer cents and split by largest remainder with stable tie-breaks, so a group's shares always add up to the total.`
- `Next.js talks to Apps Script over an HMAC-signed bridge. Apps Script owns authorization, the math and all writes.`
- `Every change goes to an append-only audit log with before and after values. Deletes are soft.`
- `If a save's response is lost, the app keeps the request and retries it with the same ID, so an entry can't be duplicated.`
shots: wide group `A group's balance and who owes whom`, wide insights `Spending by category`, wide overview `All groups at a glance`, phone `Adding an expense on a phone`. Verify captions by opening the images; adjust only if a caption is plainly wrong.

**transit-ledger**, 2026. tagline: `A personal finance app for tracking rent, commute and spending during a summer in New York.` summary: `I tracked a summer in New York against a fixed budget. Eleven data models cover transactions, budgets, recurring bills, group splits and reports, and I can log expenses by speaking them.`

**ats-resume-tailor**, 2026. tagline: `Tailors my résumé to a job description without letting the model make anything up.` summary: `It takes my master résumé as JSON and a job description, then produces a one-page LaTeX PDF. Gemini plans and writes under Pydantic schemas. Plain code does the keyword matching, checks that every bullet cites a real fact from the master résumé, and fits the page. It's a personal tool behind a password.` stack: `Python, FastAPI, Pydantic, Gemini API, Jinja2, LaTeX`. shots: []. build:
- `Code, not the model, maps each job requirement as direct, proxy or missing, then ranks roles and projects.`
- `Validators reject unknown or duplicate fact sources, changed employers, dates or titles, and any technology the cited facts don't mention.`
- `Tectonic renders the LaTeX, and a PyPDF loop fits the result to one page.`
- `A persistent single-worker queue, per-stage checkpoints and Server-Sent Events let failed runs resume with visible progress. It has 383 pytest tests.`

**mint-game-hub**, 2026. tagline: `Five daily browser games about trading cards, built for an intern team and adopted for its hobby immersion program.` summary: `2048, Hangman, Crossword, Memory Matching and Higher/Lower, each with a daily challenge. The team had no developer, so I built it on my own.` shots: the 3 new images, wide.

**centro**, `2025–2026`, liveUrl `http://pi.cs.oswego.edu:5001/`, title `Centro Oswego Live`. tagline: `Live bus arrivals and a map for Centro's Oswego routes.` summary: `I rebuilt this from scratch after an incomplete team prototype from a course. A Flask service proxies Clever Devices BusTime and a React front end shows arrivals, a live Leaflet map, active buses and schedules. It runs on a university server.` stack: `Python, Flask, React 18, Leaflet, pytest, Jest`. build:
- `7 Flask REST blueprints under /api/v1.`
- `An in-memory TTL cache, from 12 seconds for predictions up to 1 hour for stop lists.`
- `103 automated tests: 71 pytest and 32 Jest with React Testing Library.`
shots: wide map `Live map with route and bus position`, wide arrivals `Arrivals for a stop`, wide home `Choosing a route`, phone `Arrivals on a phone`. Remove `transit-tracker` from `otherProjects`.

**higheredjobs-review**, 2026, repoUrl `https://github.com/Vandanp14/HigherEdJobs_Scraper`, liveNote `Runs locally, so there's no live demo.` tagline: `Finds higher-ed IT jobs and flags what each posting says about visa sponsorship.` summary: `A Playwright scraper reads 2 job boards into SQLite. A classifier sorts each posting's sponsorship wording into 5 categories and shows the exact sentence behind the label. A React dashboard ranks jobs against my résumé and tracks my applications.` stack: `Python, Playwright, FastAPI, SQLite, React, TypeScript`. shots: []. build:
- `Parsing tries JSON-LD first, then semantic selectors. It fails loudly, so a bot check is never read as "no sponsorship".`
- `Upserts are idempotent: re-scraping never resets my status or notes, or downgrades a description.`
- `The classifier is versioned, and saved jobs get relabelled when it changes.`
- `Scraping is sequential and polite. When a human check appears, it pauses and waits for me rather than trying to bypass it.`

`otherProjects`, in this order, `blurb` exact, `year`/`stack`/`url` kept from the current entry when one exists:
- `ra-tools`, RA Tools, 2026, stack `Google Apps Script, Gmail API, Playwright`: `Resident email and check-in logging for RAs, with a hand-built MIME layer over the Gmail API.`
- `ta-grading`: `Grades student submissions with regex parsing, builds an HTML report for each and emails them out.`
- `http-server`: `An HTTP server written from scratch in C++17 on POSIX sockets, with a four-thread worker pool.`
- `job-scraper`: `Collects job listings with headless Selenium and BeautifulSoup.`
- `rsvp-tracker`: `A React front end over Google Apps Script and the Sheets API for tracking event RSVPs.`
- `lakerhacks-agent`: `Built in 24 hours at LakerHacks, where we placed in the top 10 of 30 teams. Gemini turns a team's notes into project milestones.`
- `inference-engine`: `A forward-chaining logic reasoner in Clojure.`
- `pattern-matcher`: `A recursive-descent parser in Scala that compiles regex syntax into an AST.`
- `turing-machine`: `A Turing machine emulator in C, with a linked list for the tape and a live view of the head.`
- `light-up`: `A Light Up puzzle solver written in Answer Set Programming with Clingo.`

- [ ] **Step 4: Verify.** Lint, typecheck and build pass; `git status` shows no `package-lock.json` change.
- [ ] **Step 5: Commit** `feat: add new projects and real screenshots`.

### Task 2: Visual system, shell and home

**Files:**
- Modify: `src/index.css`, `tailwind.config.js`, `index.html`, `src/App.tsx`, `src/main.tsx`, `src/components/Nav.tsx`, `Footer.tsx`, `SectionPage.tsx`, `NotFound.tsx`, `primitives.tsx`, `src/lib/router.ts`, `src/lib/routes.ts`, `api/_lib/site.ts`
- Create: `src/components/Home.tsx`, `src/components/PageRows.tsx`
- Delete, once unused: `Hero.tsx`, `HeroField.tsx`, `PageIndex.tsx`, `MenuOverlay.tsx`, `Wordmark.tsx`, `src/components/motion/*`, `src/lib/reveal.ts`

**Interfaces:**
- Consumes: `profile`, `pages`.
- Produces: `primitives.tsx` exports `Shell` (640px column, 20px gutter), `Wide` (max 960px centred breakout, safe at 320px), `PageTitle({children})`, `SectionTitle({children})`, `Meta({children})`, `TextLink`. `PageRows({rows})` draws hairline rows with a right arrow. `SectionPage` renders `<Shell>` with `PageTitle` and no "Next" row or band prop; its `id` prop stays, for Task 3 and 4. Tokens as in the spec, in `:root` and `:root[data-theme='dark']`.

- [ ] **Step 1: Tokens and type.** Rewrite `index.css` to the spec's tokens and sizes. Remove reveal, scramble, marquee, glitch, flicker, progress-sweep, device, burger, overlay and direction-based transition CSS. Keep `.post-body`, `.skeleton`, `.field` and `.sr-only` behaviour. Keep `.band`, `.band-paper`, `.band-mist` and `.band-slate` temporarily, all resolving to the same neutral tokens, for Blog and Resume until Task 4. `index.html` loads Geist only and drops Geist Mono; `.mono`/`.t-index`/`.t-eyebrow`/`.label` temporarily resolve to Geist 14px, `--text-3`, no uppercase. Set theme-color meta to the tokens.
- [ ] **Step 2: Router.** Replace direction-based View Transition with plain `navigate`. `.page-enter` is a 150ms opacity fade, none under `prefers-reduced-motion`. Remove `data-nav-dir` and `depth`. Keep scroll-to-top and analytics.
- [ ] **Step 3: Nav and footer.** Static (not fixed) top bar inside a 640px column: name left, 15px, weight 500, linking home; right: Work, Experience, About, Writing, Contact at 14px `--text-2`, current page `--text`, then `ThemeToggle`. Wraps below the name on narrow screens with 44px tap targets. No overlay. Footer: hairline; left `Vandan Patel`; right email, GitHub, LinkedIn as 14px text links. Remove any `--nav-h` padding.
- [ ] **Step 4: Home.** `Home.tsx`: `<h1>` at 40px `Vandan Patel`; then, exact:
  - `I'm a software engineer finishing a computer science degree at SUNY Oswego. I graduate in December 2026.`
  - `At Fanatics, I built Product Builder's first API and an AI assistant that can read its data. Outside of work I build tools I use myself, like <a href="/work/oswego-dining">a dining hall menu ranked by protein</a> and <a href="/work/centro">a campus bus tracker</a>.`
  Then `PageRows` for Work, Experience, About, Writing, Résumé, Contact, with labels only: no teasers, numbers or stat strip. Links use the client-side `Link`.
- [ ] **Step 5: Routes copy.** In `routes.ts` remove `teaser`, `nextPage`, `depth`. Descriptions, also in `SECTION_PAGES` in `api/_lib/site.ts`: Work `Projects by Vandan Patel, including a fitness app, a dining hall menu, a bus tracker and a shared-expense app.`; Experience `Vandan Patel's experience at Fanatics and SUNY Oswego.`; About `Vandan Patel's education, tools and recognition.`; Contact `How to reach Vandan Patel.`; Blog `Notes on what I build.`. Keep the rest.
- [ ] **Step 6: NotFound.** Plain: title `Page not found`, one line, link home.
- [ ] **Step 7: Verify.** Lint, typecheck, build. Run dev; at 320, 390 and 1440 in light and dark, home has no horizontal scroll and no console errors. Grep shows no imports of deleted files.
- [ ] **Step 8: Commit** `feat: replace visual system with a plain single-column shell`.

### Task 3: Project list, detail pages and server metadata

**Files:**
- Create: `src/components/ProjectDetail.tsx`
- Modify: `src/components/Work.tsx`, `src/App.tsx`, `vercel.json`, `api/page.ts`, `api/_lib/site.ts`, `api/sitemap.ts`, `src/content/portfolio.ts`
- Delete: `OtherWork.tsx`, `ProjectPanel.tsx`

**Interfaces:**
- Consumes: `Shell`, `Wide`, `SectionTitle`, `Meta`, `PageRows`, `Picture`.
- Produces: `projectById(id: string): Project | undefined` in `portfolio.ts`; `PROJECT_PAGES: Record<string, { title: string; description: string }>` in `api/_lib/site.ts`, keyed by project id, with `description` equal to the project's tagline. Add a comment on both sides to keep them in sync.

- [ ] **Step 1: List.** `/work` title `Work`. Featured rows: title, year at right in `--text-3` tabular-nums, tagline, stack as comma-separated 14px text; whole row links to `/work/<id>`. Then `SectionTitle` `Other projects`, same row format with `blurb`; rows with `url` link out and show an external arrow, rows without are plain text. Hairlines between rows. No images on the list.
- [ ] **Step 2: Detail.** `/work/:id`: `← Work` link, title, Meta `year · stack`, tagline at 18px, summary, links `Live site ↗`, `Source ↗` where present, `liveNote` as Meta. `SectionTitle` `How it works` with `build` as a plain list. Shots: in `Wide`; wide images one per row, phone images side by side at max 300px each, wrapping; `figure` + 14px caption, `loading="lazy"` except the first, 1px border, 6px radius. No section when `shots` is empty. Use `usePageMeta` with title and tagline.
- [ ] **Step 3: Route.** In `App.tsx`, add `/work/:id` with trailing-slash handling. Unknown id renders `NotFound`. Replace JSON-LD category with no `applicationCategory`, and each `url` with `liveUrl ?? ${SITE_ORIGIN}/work/${id}`. Remove `index`, `category`, `metrics` from the type and data.
- [ ] **Step 4: Server.** Add a `/work/:id` rewrite to `/api/page?path=/work/:id` in `vercel.json`. In `api/page.ts`, serve project meta from `PROJECT_PAGES`; an unknown id answers 404 + noindex like an unknown post. Add every project to `api/sitemap.ts`. Do not change the CSP.
- [ ] **Step 5: Verify.** Lint, typecheck, build. With `npm run dev`: `curl -s localhost:5173/api/page?path=/work/oswego-dining` has the project title; `path=/work/nope` returns 404 with noindex. Browser checks at 320, 390 and 1440, light and dark: `/work`, `/work/oswego-dining`, `/work/evenly`, `/work/ats-resume-tailor` (no empty gallery), and reload on a detail page.
- [ ] **Step 6: Commit** `feat: add project list and detail pages`.

### Task 4: Remaining pages

**Files:**
- Modify: `Experience.tsx`, `About.tsx`, `Contact.tsx`, `src/pages/Blog.tsx`, `src/pages/Resume.tsx`, `App.tsx`, `src/content/portfolio.ts`, `src/index.css`, `tailwind.config.js`
- Delete: `FanaticsBanner.tsx`, `src/assets/fanatics-banner.jpg` if unused

**Interfaces:**
- Consumes: `Shell`, `PageTitle`, `SectionTitle`, `Meta`, `TextLink`.
- Produces: removal of `stats`, `fanaticsHighlight`, `headline`, `disciplines`, `status`, `SkillGroup.note`, and all `.band*`, `.mono`, `.t-*`, `.label` CSS.

- [ ] **Step 1: Experience.** For each role: company + title, Meta `period · location`, `summary`, then highlights as a plain list. Stack as comma-separated Meta. No banner or metrics. Replace Fanatics `summary` with `Product Builder is the app Fanatics uses to configure trading-card products for manufacturing. I built its first API and an AI assistant that can answer questions about its data.` Replace Fanatics `highlights`, in order, exactly:
  - `Built an AI assistant that lets people ask about trading-card specs in plain English from Slack. Requests go through an internal message router to an Elixir runtime on AWS Bedrock AgentCore and a Phoenix backend.`
  - `Built Product Builder's first API: 5 read-only REST endpoints with generated OpenAPI 3.0 docs, so MCP tools can discover them automatically.`
  - `Used a read-only repository so that any write through the API fails at compile time.`
  - `Wrote a server-side SQL query that matches legacy ULIDs, newer UUIDs and roster entities, which recovered 36.5% of under-reported card data.`
  - `Wrote AWS Signature V4 signing in plain Elixir for IAM calls to Bedrock and CloudWatch over IMDSv2, instead of adding a large SDK.`
  - `Set up the API to fail closed, with feature flags, constant-time request verification, default-deny visibility and whitelisted JSON fields.`
  - `Tested on staging with 82,000+ records. The slowest query took 37 ms before any tuning. All 86 tool tests passed across two full regression runs of about 2,900 tests.`
  - `Shipped 3 features to production in 8 weeks. My first PR merged within 2 weeks, and the work came to about 4,000 lines across two stacked PRs.`
  - `Wrote a 13-step MCP migration roadmap and a 4-chapter handoff for moving direct HTTP tool calls to Bedrock Gateway MCP targets.`
- [ ] **Step 2: About.** Sections Education, Tools, Recognition, Leadership in `Shell`. Tools: label plus comma-separated skills, with no notes. No pills or grids.
- [ ] **Step 3: Contact.** Lead with `The best way to reach me is email.` and the address as a link, then GitHub, LinkedIn, Résumé text links. Keep the existing form working, with its logic unchanged, restyled under `SectionTitle` `Or send a message`, with sentence-case labels, a plain button, and inline success and error states.
- [ ] **Step 4: Blog and Resume.** Restyle to `Shell` and tokens, with `Wide` for the PDF viewer only if needed. Keep all data, sanitizing, loading, empty and error behaviour. Blog list: hairline rows with title, date, excerpt. Post: 640px `.post-body`, readable in dark, code and images contained at 320px.
- [ ] **Step 5: Remove temporary code.** Delete `.band*`, `.mono`, `.t-*`, `.label` and unused utilities and Tailwind config entries. Grep confirms no references.
- [ ] **Step 6: Verify.** Lint, typecheck, build. Browser checks at 320, 390 and 1440, light and dark, on `/experience`, `/about`, `/contact`, `/blog`, a post, `/resume`, with no console errors. Validate the contact form's client-side error state without submitting a real message.
- [ ] **Step 7: Commit** `feat: restyle remaining pages`.

### Task 5: Clean-up and docs

**Files:**
- Modify: `index.html`, `api/_lib/site.ts`, `api/og.ts` (only if needed), `CLAUDE.md`, `AGENTS.md` if it repeats it, `README.md`
- Delete: anything now unused

- [ ] **Step 1: Purge.** `grep -rn "systems other people\|Progress: shipped\|ten more builds"` across `src api index.html public README.md` returns nothing. Default description, in `index.html` and `DEFAULT_DESCRIPTION`: `Vandan Patel is a software engineer finishing a computer science degree at SUNY Oswego.`. Change `api/og.ts` only if it shows a removed slogan, and then bump `v`.
- [ ] **Step 1b: Voice pass.** Rewrite every remaining piece of user-facing copy that this plan does not give exactly, to the Global Constraints voice, without adding, removing or changing any fact or number: `build` bullets on `mfp-coach`, `transit-ledger`, `mint-game-hub`; screenshot captions; non-Fanatics `experience` summaries and highlights; `recognition` and `leadership` notes; UI strings in Contact, Blog, Resume, NotFound and error states. Then grep `src index.html api` case-insensitively for each banned word and for `—` in user-facing strings, and report all hits and how each was resolved. Dates like `Jun 2026 — Present` may use an en dash instead.
- [ ] **Step 2: Docs.** Update `CLAUDE.md` Architecture for the new system: routes including `/work/:id`, `PROJECT_PAGES` kept in sync with `featuredProjects`, tokens in `index.css`, no bands, no reveal engine, no motion components. Point content at `~/Desktop/ATS_Resume_Tailor_Agent/master.json`. Remove the repo's stale `master_resume.json` only if nothing references it; otherwise leave it and report.
- [ ] **Step 3: Dead code.** Grep for each file in `src/components` and `src/lib` being imported; delete the unused.
- [ ] **Step 4: Verify.** Lint, typecheck, build. Report the main bundle size before and after against `origin/main`.
- [ ] **Step 5: Commit** `chore: remove old design code and update docs`.
