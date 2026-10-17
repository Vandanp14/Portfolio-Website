# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio website for Vandan Patel (live at [vandanpatel.me](https://vandanpatel.me)), built with Vite + React 18 + TypeScript + Tailwind CSS 3. Deployed on Vercel with continuous deployment from GitHub.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build (output: dist/) + postbuild copies index.html → 404.html
npm run lint       # ESLint (flat config, eslint.config.js)
npm run preview    # Preview production build locally
```

There are no tests.

## Architecture

- **`src/App.tsx`** — tiny router switch (`src/lib/router.ts`, History API, no react-router). `/` is the hero plus `PageIndex` (full-width rows linking every page); `/work`, `/experience`, `/about`, `/contact` are `SectionPage`s built from the old home sections (each ends with a "Next" row); `/blog`, `/blog/:id` and `/resume` lazy-load (`src/lib/prefetch.ts`, warmed on link hover/focus); anything else renders `NotFound`. Legacy `/#work`-style links are rewritten to `/work` before first render.
- **`src/lib/routes.ts`** — the page registry (`pages`: id, path, label, teaser, description) in index order. The order also sets transition direction: `router.navigate()` wraps every route change in a View Transition and sets `<html data-nav-dir="forward|back">` (later page / Back), styled in `index.css` ("Page transitions"); the nav keeps its own `view-transition-name` so it stays put. No View Transitions → `.no-vt .page-enter` CSS slide; reduced motion → instant. Server-side titles/descriptions for section pages live in `SECTION_PAGES` (`api/_lib/site.ts`) — keep both in sync.
- **`src/content/portfolio.ts`** — all portfolio content (jobs, projects, profile, `RESUME_URL` = `/resume`, `navSections`). Edit content here, not in JSX.
- **`src/components/*`** — one component per section plus `Nav` (floating inset bar; flips dark over `.band-slate`), `MenuOverlay` (full-screen menu), `Footer`, `Wordmark`, `primitives.tsx` (`Shell`, `Eyebrow`, `SectionHeading`, box buttons) and `Link.tsx` (client-side nav link). `goToSection(id)` navigates to `/<id>`.
- **`src/components/motion/*`** — `SplitLines` (word-by-word masked rise), `Scramble` (glyph decode for mono labels), `Rule` (drawn hairline), `Marquee`.
- **`src/lib/reveal.ts`** — page-wide reveal engine started in `main.tsx`: anything with `.reveal` or `data-reveal="lines|clip|wipe|cover|rule|fade"` gets `.is-in` once on scroll-in, including nodes that mount later. `clip`/`wipe` are observed via their parent (Chrome intersects a target with its own clip-path). Content that swaps in place uses mount animations (`.anim-rise|clip|fade`) instead.
- **`src/index.css`** — Palantir-inspired editorial system. Band system: `.band-paper` (white) / `.band-mist` (#EEE) / `.band-slate` (#1E2124) each redeclare the same CSS variables (`--bg`, `--text`, `--accent`, …); components never hardcode colours. Regular-weight Geist type roles (`.t-display`, `.t-title`, `.t-eyebrow`/`.label`, `.t-index`/`.mono`; `.font-editorial` is an alias of the display voice), sharp corners, reveal variants, blog `.post-body` prose, `.skeleton`, preview animations. Fonts: Geist, Geist Mono. Fixed nav clearance is `pt-[var(--nav-h)]`.

### External services (Google Apps Script)
- **Contact form** — `src/lib/contact.ts` POSTs to `VITE_CONTACT_ENDPOINT` (source in `apps-script/`).
- **Blog** — `src/lib/blog.ts` GETs a separate public Apps Script deployment (`VITE_BLOG_ENDPOINT`, hardcoded default): `?api=posts` → `{title, description, posts:[{id,title,date}]}`, `?api=post&id=` → `{post:{…, html}}`. Posts are written in Google Docs. The index has no excerpts, so the blog list fetches each post in the background to build previews (and caches them, so opening a post is instant). Post HTML is sanitized with DOMPurify before rendering.
- **Blog proxy** — the browser reads the blog through `api/blog.ts` (same query shape, CDN-cached 5 min + SWR), not Apps Script directly. `src/lib/blog.ts` adds a sessionStorage layer (10 min TTL).
- **Per-route HTML** — `vercel.json` rewrites `/work`, `/experience`, `/about`, `/contact`, `/blog`, `/blog/:id` and `/resume` to `api/page.ts`, which takes the deployment's `index.html` and injects route-specific title/description/canonical/OG/Twitter + JSON-LD (unknown post → 404 + noindex). `src/lib/seo.ts` (`usePageMeta`, `useJsonLd`) keeps the same tags right after client-side navigation.
- **OG images** — `api/og.ts` (`@vercel/og` 0.11.x; 1.x breaks in Node ESM) renders the 1200×630 card: bare = home, `?title=&date=&min=` = post. URLs carry `v=` and are cached immutable — bump `v` when the design changes.
- **Feeds** — `/sitemap.xml` → `api/sitemap.ts`, `/rss.xml` → `api/rss.ts`; `/api/health` for uptime. Shared server helpers live in `api/_lib/` (underscore = not a function; imports use `.js` endings for Node ESM). `vite.config.ts` `devApi()` serves every `api/*.ts` under `npm run dev`.
- **Security headers + CSP** in `vercel.json`. No inline scripts allowed: theme init and GA4 live in `public/boot.js` (render-blocking). Adding a third-party origin means updating the CSP.
- **Uptime** — `.github/workflows/uptime.yml` checks key URLs every 15 min; a failed run emails the repo owner.
- **Theme** — light by default; `src/lib/theme.ts` + `ThemeToggle` (nav and menu) set `<html data-theme>` and persist to localStorage. Dark overrides live under `:root[data-theme='dark']` in `index.css` (paper/mist redeclare band vars; slate unchanged).
- **Images** — `vite-imagetools` (9.x for Vite 5): import with `?w=…&format=avif;webp;jpg&as=picture` and render via `<Picture>` in `primitives.tsx`.
- **Perf** — `@vercel/speed-insights` injected in `main.tsx` (enable Speed Insights in the Vercel project).

- **Résumé** — `/resume` (`src/pages/Resume.tsx`, lazy, pdf.js legacy build) shows the newest PDF in a Drive folder. A third Apps Script deployment serves it as base64 chunks (`?action=latest`, `?action=chunk&version=&index=`). `api/resume.ts` is a Vercel Function that stitches the chunks into a real PDF (`RESUME_ENDPOINT`, hardcoded default): `?meta=1` (CDN 60s), `?v=VERSION` (immutable), bare / `/resume.pdf` (newest, CDN 60s); a superseded version answers 409. `vite.config.ts` mounts the same function under `npm run dev`. To update the résumé, upload a newer PDF to the Drive folder — no code change.
